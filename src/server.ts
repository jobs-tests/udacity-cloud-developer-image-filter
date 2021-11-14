import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isURLValid} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter Image ENDPOINT
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async(req: Request, res: Response) => {
    const {image_url : imageUrl} = req.query;
    if(!isURLValid(imageUrl)){
      return res.status(421).send({ message: 'Invalid Url' });
    }
    try{
      const filteredPath = await filterImageFromURL(req.query.image_url);
      res.sendFile(filteredPath);
      res.on('finish', () => deleteLocalFiles([filteredPath]));
    }
    catch(exception ){
        console.log(exception)
        res.status(500).send({ message: 'Encountered error ' });
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();