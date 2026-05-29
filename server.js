const express = require("express");

const cors = require("cors");

const multer = require("multer");


const { createClient } = require("@supabase/supabase-js");


const app = express();


app.use(cors());

app.use(express.static("public"));

app.use('/models', express.static('models')); 


const supabase = createClient("https://jedbzxzqynxpjpdpensz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGJ6eHpxeW54cGpwZHBlbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTgxODksImV4cCI6MjA5NTYzNDE4OX0.JgBNRi33xR85XngSCyEJwV8fXTCJQk0fPI86_jGOVis");

const storage = multer.memoryStorage();

const upload = multer({ storage });


app.post("/upload", upload.single("photo"), async (req, res) => {


  try {


    const emotion = req.body.emotion;


    const file = req.file;


    const fileName =

      Date.now() + ".jpg";


    // Upload para storage no supabase

    const { data, error } =

      await supabase.storage

        .from("photos")

        .upload(fileName,

          file.buffer,

          {

            contentType: "image/jpeg"

          });


    if (error)

      throw error;


    // Ligar URL pública

    const { data: publicUrl } =

      supabase.storage

        .from("photos")

        .getPublicUrl(fileName);


    // Guardar na tabela

    await supabase

      .from("students")

      .insert([{

        name: "unknown",

        emotion: emotion,

        photo_url:

          publicUrl.publicUrl


      }]);


    res.json({

      message: "Guardado com sucesso"

    });


  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message

    });

  }

});


app.listen(3000, () => {

  console.log("Servidor a correr em http://localhost:3000");

});