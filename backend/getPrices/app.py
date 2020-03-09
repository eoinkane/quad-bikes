import json
import boto3

print('Loading function')

s3 = boto3.client('s3')

def processResponse(status_code: int, bodyMessage: str, bodyObj: dict) -> dict:
    return {
        "statusCode": status_code,
        "body": (json.dumps(bodyObj)) if (bodyMessage is None) else json.dumps({"error": bodyMessage}),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS"
        },
        "isBase64Encoded": "false"
    }

def validParameters(event):
    valid = None
    errorAtParameter = None

    def validParametersResponse():
        return {
            "valid": valid,
            "errorAtParameter": errorAtParameter
        }
    valid = True

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

def fileGet(bucket: str, key: str):
    response = s3.get_object(Bucket=bucket, Key=key)
    responseBody = response['Body'].read().decode('utf-8')
    json_content = json.loads(responseBody)
    return json_content["data"]

def lambda_handler(event, context):
    print(event)
    print(context)
    print("\n\n\n\n")
    # Check if lambda has recieved correct parameters
    allowContinue = validParameters(event)
    if (not allowContinue["valid"]):
        return processResponse(400, f'Invalid Parameters passed to lambda: {allowContinue["errorAtParameter"]}', None)

    bucket = "quad-bikes-data"
    key = "prices.json"

    def selectedFileOpen():
        fileSrc = fileGet(bucket, key)
        return fileSrc

    result = attempt(selectedFileOpen, {
        "statusCode": 500,
        "msg": "Opening Failed",
        "obj": None
    }
    )

    # safety check of selectedFileOpen()
    if (result["statusCode"] < 200 or result["statusCode"] > 300):
        return processResponse(result["statusCode"], (result["msg"] + '. Error getting object {} from bucket {}. Make sure they exist.'.format(key, bucket)), result["obj"])

    return processResponse(result["statusCode"], result["msg"], result["obj"])
