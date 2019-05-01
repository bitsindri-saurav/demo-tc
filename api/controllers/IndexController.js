/**
 * IndexController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const AWS = require('aws-sdk');
// const fs = require('fs');
// const pdf = require('pdf-parse'); 
const fs = require("fs");
const https = require("https");
// let dataBuffer = fs.readFileSync('path to PDF file...');
// fs.readFileSync('http://www.africau.edu/images/default/sample.pdf');
var request = require('request');

AWS.config.update(
    {
        accessKeyId: 'AKIAJODVMCIMI3WFAWYA',
        secretAccessKey: 'dQ7cYqBY2cHc6nJm5JhfKTRbD5j8HV4XC/lsMq0f'
    }
);
module.exports = {

search: function(req,res){
    var albums;
    var info ;
    var similar;
    var tracks;
res.render('pages/demo',{albums:albums, info : info, similar : similar, tracks : tracks})
},
  demo: function(req,res){
    res.render("pages/demo")
  },  
 demo1 : function (req,res){
     console.log(req.allParams())
    const LastFM = require('last-fm')
    const lastfm = new LastFM('6d8d6f221ec48c6956d515ef198ae58c')
    var search = req.allParams().search
    var albums;
    var info ;
    var similar;
    var tracks;
    lastfm.artistTopAlbums({name : search, limit : 20}, (err, data) => {
        if (err) {
            console.error("errrrrrrrrrrrrrrrrr",err)
            res.send({code:1,info: "The artist you supplied could not be found"})
        }
        else 
        {
         
        albums = data.result
        console.log("albums",albums) 
        lastfm.artistInfo({name : search, limit : 20}, (err, data) => {
            if (err) console.error(err)
            else {
                console.log(data)
                info = data
                lastfm.artistSimilar({name : search, limit : 20}, (err, data) => {
                    if (err) console.error(err)
                    else {
                        similar = data.artist;
                        console.log("artist", data)
                        lastfm.artistTopTracks({name : search, limit : 20}, (err, data) => {
                            if (err) console.error(err)
                            else {
                                tracks = data.result;
                                console.log(tracks)
                                res.render('pages/demo1',{albums:albums, info : info, similar : similar, tracks : tracks}) 
                            }})
                        
                        
                    } 
                })
                 
            }
             
        })  
        }

      })

 } ,
dashboard:function(req, res){
    console.log("dashboard")
//     request.get({url:'https://nutriwork.s3.amazonaws.com/docs/f17b7d5b-47fb-481e-9974-b100efe65722.pdf?AWSAccessKeyId=AKIAJODVMCIMI3WFAWYA&Expires=1555876897&Signature=s09oxNjH9E6J4gONHvkVhWRijOo%3D', 
//     "Content-Type": 'application/pdf'}, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         var csv = body;
//         console.log("body",csv);
//         // Continue with your processing here.
//     }
//     else{
//         console.log(error)
//     }
// });


// request('').pipe(fs.createWriteStream('assets/temp-docs/1.pdf'))

//     https.get("https://www.w3.org/TR/PNG/iso_8859-1.txt", response => {
// //   var stream = response.pipe(file);
// console.log(response)
// //   stream.on("finish", function() {
// //     console.log("done");
// //   });
// });
    // pdf(dataBuffer).then(function(data) {
    //     console.log(data)
    // })
    // .catch(function(err){
    //    console.log(err)
    // })
    res.render('pages/dashboard')
    
},

login:function(req, res){
    res.render('pages/login')
},

signup:function(req, res){
    res.render('pages/signup')
},

contacts:function(req, res){
    res.render('pages/contacts')
},
profile:function(req,res){
    res.render('pages/profile')
},
support:function(req,res){
    res.render('pages/support')
},
upcomp:function(req,res){
    res.render('pages/upcomingcompanies')
},
visitcomp:function(req,res){
    res.render('pages/visitedcompanies')
},
nutri: function(req,res){
    var filePath = 'assets/temp-docs/1.pdf'; 
fs.unlinkSync(filePath);
    res.render('pages/nutriworkouts')
},
upload: function (req, res) {
    req.file('userPhoto').upload({
      adapter: require('skipper-better-s3'),
      key: 'AKIAJODVMCIMI3WFAWYA',
      secret: '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',
      bucket: 'nutriwork', 
      dirname: 'docs',
    //   saveAs: '1.pdf'
     
      
    }, function (err, filesUploaded) {
        console.log(filesUploaded)
      if (err) return res.send({code: 0, error: err,message: "file upload issue on s3"});
      console.log("success")
      console.log(filesUploaded[0].extra.Key)
      let fileKey = filesUploaded[0].extra.Key
    console.log("asfafasfa")
    var s3 = new AWS.S3();
                var options = {
                    Bucket : 'nutriwork',
                    Key : `${fileKey}`,
                };

                const url = s3.getSignedUrl('getObject', options)
                console.log(url);
    res.send({link:url})

    });


    
  },
upload1: function  (req, res) {
  if(req.method === 'GET')
   return res.json({'status':'GET not allowed'});  
//    console.log(req.file())    
  
//   sails.log.debug('We have entered the uploading process ');
req.file('userPhoto').upload({
    adapter: require('skipper-s3'),
    key: 'AKIAJODVMCIMI3WFAWYA',
    secret: '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',
    bucket: 'nutriworkouts',
    dirName: 'nutriworkout/Docs/'
}, async function whenDone(err, filesUploaded) {
    console.log("file uploaded..!");
    if (err) {
        return res.send({code: 0, error: err,message: "file upload issue on s3"});
    } else {
        // uploaded
        console.log(filesUploaded);
        if(errors.length != 0) {
            res.send({code: 0, message: 'error', errors: errors});
        } 
        // else {
        //     try {
        //         await Expense.update({id: expense.id}).set({receipt: filesUploaded[0].fd})
        //     } catch(e) {
        //         console.log("no reciept uploaded")
        //         console.log(e);
        //     }
        // }
    
    }
})
//   req.file('userPhoto').upload({
//    dirname:'../../assets/images/'},
//    function(err,files){
//    sails.log.debug('file is :: ', +files);
//     maxBytes: 10000000;
//    if (err) return res.serverError(err);        
//    console.log(files);
//       res.json({status:200,file:files});
//    });
 },


// upload : function (req, res) {
//     console.log(req.allParams())
//     req.file('fileup').upload({
//       // don't allow the total upload size to exceed ~100MB
//       maxBytes: 100000000,
//       // set the directory
//       dirname: '../../assets/images'
//     },function (err, uploadedFile) {
//       // if error negotiate
//       if (err) {
//           console.log(err)
//       }
//       // logging the filename
//       console.log(uploadedFile);
//       res.send({message:"sadasdasdasasfasas"})
//       // send ok response
//     //   return res.ok();
//     })
//   },

};

