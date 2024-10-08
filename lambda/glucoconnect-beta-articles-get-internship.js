const { DynamoDBClient,QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "GlucoConnectArticles";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // Authorization ヘッダのバリデーション
  if (event.headers.authorization !== "mtitoken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください",
    });
    return response;
  }

  // クエリパラメータから DynamoDB Query 用のパラメータを生成
  const { userId } = event.queryStringParameters || {};

  // userIdが提供されていない場合はエラーを返す
  if (!userId) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "userIdが指定されていません。",
    });
    return response;
  }

  const queryParam = {
    TableName,
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: marshall({
      ":uid": userId,
    }),
  };

  try {
    const result = await client.send(new QueryCommand(queryParam));
    const articles = result.Items.map((item) => unmarshall(item));

    response.body = JSON.stringify({ articles });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};