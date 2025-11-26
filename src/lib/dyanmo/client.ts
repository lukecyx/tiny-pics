import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export let dynamoClient: DynamoDBClient | null;

export function getDynamoDbClient() {
  if (!dynamoClient) {
    return new DynamoDBClient({ region: "eu-west-1" });
  }

  return dynamoClient;
}
