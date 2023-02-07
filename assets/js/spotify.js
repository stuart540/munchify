var spotifyResponse = {
    "playlists": {
      "href": "https://api.spotify.com/v1/search?query=italian&type=playlist&locale=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&offset=0&limit=1",
      "items": [
        {
          "collaborative": false,
          "description": "",
          "external_urls": {
            "spotify": "https://open.spotify.com/playlist/0jABlXmvlbRqc6PlJkJAtZ"
          },
          "href": "https://api.spotify.com/v1/playlists/0jABlXmvlbRqc6PlJkJAtZ",
          "id": "0jABlXmvlbRqc6PlJkJAtZ",
          "images": [
            {
              "height": null,
              "url": "https://i.scdn.co/image/ab67706c0000bebbf9836406726574e8939db34b",
              "width": null
            }
          ],
          "name": "Italian Vintage Summer",
          "owner": {
            "display_name": "Abdel Hafid",
            "external_urls": {
              "spotify": "https://open.spotify.com/user/1134689066"
            },
            "href": "https://api.spotify.com/v1/users/1134689066",
            "id": "1134689066",
            "type": "user",
            "uri": "spotify:user:1134689066"
          },
          "primary_color": null,
          "public": null,
          "snapshot_id": "NjcsNDQ2Zjg3MjhiNTJiOTYyZDM2ZjdiYzgyNTM1M2I4MzM5MzM1M2M5Mg==",
          "tracks": {
            "href": "https://api.spotify.com/v1/playlists/0jABlXmvlbRqc6PlJkJAtZ/tracks",
            "total": 43
          },
          "type": "playlist",
          "uri": "spotify:playlist:0jABlXmvlbRqc6PlJkJAtZ"
        }
      ],
      "limit": 1,
      "next": "https://api.spotify.com/v1/search?query=italian&type=playlist&locale=en-GB%2Cen-US%3Bq%3D0.9%2Cen%3Bq%3D0.8&offset=1&limit=1",
      "offset": 0,
      "previous": null,
      "total": 1000
    }
  }
  
var playlistImg = spotifyResponse.playlists.items[0].images[0].url;

$("#submitBtn").on("click",function(){
    console.log(playlistImg);
    $("#playlistPhoto").attr("src",playlistImg);
})

