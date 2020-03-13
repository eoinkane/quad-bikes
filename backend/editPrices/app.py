import json
import boto3


def processResponse(status_code: int, bodyMessage: str, bodyObj: str) -> dict:
    return {
        "statusCode": status_code,
        "body": json.dumps({"message": bodyObj}) if (bodyMessage is None) else json.dumps({"messsage": bodyMessage}),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS"
        },
        "isBase64Encoded": False
    }


def validParameters(event):
    valid = None
    errorAtParameter = None

    def validParametersResponse():
        return {
            "valid": valid,
            "errorAtParameter": errorAtParameter
        }
    try:
        if (event['body'] is None):
            valid = False
            errorAtParameter = "Missing Body"
            return validParametersResponse()
        else:
            valid = True
    except Exception as e:
        valid = False
        errorAtParameter = "Missing Body"
        return validParametersResponse()

    try:
        json.dumps(event['body'])
        valid = True
        return validParametersResponse()
    except Exception as e:
        valid = False
        errorAtParameter = "Invalid JSON in Body"
        return validParametersResponse()

    return validParametersResponse()


def attempt(attempt, errorObj: dict):
    try:
        local = attempt()
        return {
            "statusCode": 200,
            "obj": local["obj"],
            "msg": None
        }
    except Exception as e:
        errorObj["msg"] = str(e)
        return errorObj


def filePut(x):
    response = None

    def dict_to_binary(the_dict):
        str = json.dumps({"data": the_dict})
        binary = ' '.join(format(ord(letter), 'b') for letter in str)
        return binary


    try:
        s3 = boto3.resource('s3')
        s3object = s3.Object('quad-bikes-data', 'prices.json')

        s3object.put(
            Body=(json.dumps(x).encode('utf-8'))
        )

        response = {
            "statusCode": 200,
            "msg": None,
            "obj": "Storing Object Succeeded"
        }
    except Exception as e:
        response = {
            "statusCode": 500,
            "msg": None,
            "obj": str(e)
        }


    return response




def lambda_handler(event, context):
    print(event)
    print(context)

    # Check if lambda has recieved correct parameters
    allowContinue = validParameters(event)
    if (not allowContinue["valid"]):
        return processResponse(400, f'Invalid Parameters passed to lambda: {allowContinue["errorAtParameter"]}', None)

    bodyString = json.loads(event['body'])


    print(bodyString["child"])
    print(type(bodyString))

    body = bodyString

    body_items = body.items()
    print(body_items)

    #for key in body:
        #print(key)
        #body[key]["minimumAge"] = int(body[key]["minimumAge"])
        #body[key]["maximumAge"] = int(body[key]["maximumAge"])
        #body[key]["price"] = int(body[key]["price"])

    newBody = {
        "data": body
    }

    print(newBody)

    # define what file to open
    def pricesPut():
        object = filePut(newBody)
        return object

    result = attempt(pricesPut, {
        "statusCode": 500,
        "msg": "Storing Object Failed",
        "obj": None
    }
    )

    return processResponse(result["statusCode"], result["msg"], result["obj"])
