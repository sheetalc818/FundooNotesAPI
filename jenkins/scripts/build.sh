#!/bin/bash -x

#docker -H 10.0.109.150 stop chatapp
echo $config_file
BUILD="$(($BUILD_ID-2))"
docker -H 10.0.109.150 rmi --force fundoonotes-prod:$BUILD
#         if [ "$?" == "0" ]
#             then
                 docker -H 10.0.109.150 build . -t fundoonotes-prod:$BUILD_ID
             if [ "$?" == "0" ]
                 then
		     :
                 else
                     echo "fundooNotes app build failed"
             fi
#         fi
