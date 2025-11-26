import { getDynamoDbClient } from "./client";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

export interface UpdateSessionArgs {
  sessionId: string;
  fileKeys: string[];
}

export async function updateSession({
  sessionId,
  fileKeys,
}: UpdateSessionArgs) {
  const client = getDynamoDbClient();
  const params = {
    TableName: "Sessions",
    Key: {
      SessionId: { S: sessionId },
    },
    UpdateExpression: `SET Done = :done,
      ResizedKeys = list_append(
        if_not_exists(ResizedKeys, :emptyList),
        :newKeys
      )
    `,
    ExpressionAttributeValues: {
      ":done": { BOOL: true },
      ":emptyList": { L: [] },
      ":newKeys": {
        L: fileKeys.map((key) => ({ S: key })),
      },
    },
  };

  try {
    const result = await client.send(new UpdateItemCommand(params));
    console.log("updated sessions with: ", result);
  } catch (error) {
    console.error(error);
  }
}
