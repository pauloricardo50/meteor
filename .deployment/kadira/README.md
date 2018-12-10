When adding a new app in kadira, you can set all apps to the business plan by running this:
`sudo docker-compose exec mongo mongo kadira --eval 'db.apps.update({},{$set:{plan:"business"}},{multi:true})'`
