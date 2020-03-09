import json
import requests


def processResponse(status_code: int, bodyMessage: str, bodyObj: dict) -> dict:
    return {
        "statusCode": status_code,
        "body": json.dumps({"price": bodyObj}) if (bodyMessage is None) else json.dumps({"error": bodyMessage}),
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
        if (event['pathParameters']["age"] is None):
            valid = False
            errorAtParameter = "Missing Age Parameter"
            return validParametersResponse()
        else:
            valid = True
    except Exception as e:
        valid = False
        errorAtParameter = "Missing Age Parameter"
        return validParametersResponse()

    try:
        if (int(event['pathParameters']["age"]) < 0 or int(event['pathParameters']["age"]) > 101):
            valid = False
            errorAtParameter = "Invalid Age Parameter"
            return validParametersResponse()
    except Exception as e:
        valid = False
        errorAtParameter = json.dumps(event)
        return validParametersResponse()

    return validParametersResponse()


def attempt(attempt, errorObj: dict):
    try:
        local = attempt()
        return {
            "statusCode": 200,
            "obj": local,
            "msg": None
        }
    except Exception as e:
        errorObj["msg"] = str(e)
        return errorObj


def fileOpen(x):
    with open(x, 'r') as f:
        dict = json.load(f)["data"]
    return dict


def fileOpen2(bucket: str, file: str):
    r = requests.get('https://ykf45oytvf.execute-api.us-east-1.amazonaws.com/dv/quad-bikes/get/prices')
    r_dictionary = r.json()
    return r_dictionary


def processAge(age: int, prices: dict):
    if (age > int(prices["child"]["minimumAge"]) and age < int(prices["child"]["maximumAge"])):
        return prices["child"]["price"]
    elif (age > int(prices["teenager"]["minimumAge"]) and age < int(prices["teenager"]["maximumAge"])):
        return prices["teenager"]["price"]
    elif (age > int(prices["adult"]["minimumAge"]) and age < int(prices["adult"]["maximumAge"])):
        return prices["adult"]["price"]
    elif (age > int(prices["consession"]["minimumAge"]) and age < int(prices["consession"]["maximumAge"])):
        return prices["consession"]["price"]
    else:
        return None


def lambda_handler(event, context):
    print(event)
    print(context)

    # Check if lambda has recieved correct parameters
    allowContinue = validParameters(event)
    if (not allowContinue["valid"]):
        return processResponse(400, f'Invalid Parameters passed to lambda: {allowContinue["errorAtParameter"]}', None)

    age = int(event['pathParameters']["age"])

    # define what file to open
    def pricesOpen():
        object = fileOpen2("quad-bikes-data", "prices.json")
        # object = fileOpen("./store/prices.json")
        return object

    result = attempt(pricesOpen, {
        "statusCode": 500,
        "msg": "Opening Failed",
        "obj": None
    }
    )

    print(result)

    # safety check of fileOpen()
    if (result["statusCode"] < 200 or result["statusCode"] > 300):
        return processResponse(result["statusCode"], result["msg"], result["obj"])

    def calculatePrice():
        price = processAge(age, result["obj"])
        return price

    result = attempt(calculatePrice, {
        "statusCode": 500,
        "msg": "Calculating Price Failed",
        "obj": None
    })

    return processResponse(result["statusCode"], result["msg"], result["obj"])
