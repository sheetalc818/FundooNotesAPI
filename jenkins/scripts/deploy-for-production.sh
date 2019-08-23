#!/bin/bash -x

docker -H 10.0.109.150 stop fundoonotes-prod
BUILD="$(($BUILD_ID-2))"
docker -H 10.0.109.150 rmi --force fundoonotes-prod:$BUILD


                     docker -H 10.0.109.150 rm fundoonotes-prod
                     docker -H 10.0.109.150 run --link db:db -d -p 80:3000 --name fundoonotes-prod fundoonotes-prod:$BUILD_ID
             if [ "$?" == "0" ]
                 then
		     echo "fundooNotes App successfully deployed on production"
                 else
                     echo "Production deployment failed"
             fi
