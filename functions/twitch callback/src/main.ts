import { Client, Databases, Query } from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({
  req,
  res,
  log,
  error,
}: {
  req: any;
  res: any;
  log: any;
  error: any;
}) => {
  const endpoint: string = process.env.APPWRITE_ENDPOINT!;
  const projectID: string = process.env.APPWRITE_FUNCTION_PROJECT_ID!;
  const key: string = process.env.APPWRITE_API_KEY!;
  const img_database: string = process.env.APPWRITE_DATABASE!;
  const img_collection: string = process.env.APPWRITE_DATABASE_COLLECTION!;

  const img: DeleteImageEvent = req.body;

  const client = new Client();
  client
    .setEndpoint(endpoint)
    .setProject(projectID)
    .setKey(key)
    .setSelfSigned(true);

  const database = new Databases(client);

  //log all env variables in a json object
  log(JSON
    .stringify({
      endpoint,
      projectID,
      key,
      img_database,
      img_collection,
      img,
    })
  );
  
  

  try {
    log(JSON.stringify(img));

    const response = await database.listDocuments(
      img_database,
      img_collection,
      [Query.equal('bucketID', img.bucketId), Query.equal('imageID', img.$id)]
    );

  

    if (response.documents.length > 0) {
      await Promise.all(
        response.documents.map(async (document) => {
          await database.deleteDocument(
            img_database,
            img_collection,
            document.$id
          );
        })
      );
      return res.send('Deleted', 200);
    } else {
      return res.send('img not found', 404);
    }
  } catch (e) {
    log(e);
    return res.send('something went wrong', 500);
  }
};
