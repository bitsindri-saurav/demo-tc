/**
 * IndexController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

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

};

