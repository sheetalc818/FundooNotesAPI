FROM node
MAINTAINER Vivek Hebalkar <vivek.hebalkar@gmail.com>
#RUN yum install nodejs -y
# Set the working directory
WORKDIR /usr/src/app

# First, install dependencies to improve layer caching
COPY package.json /usr/src/app/
# Add the code
COPY . /usr/src/app
#RUN npm install
EXPOSE 3000
# Set an entrypoint, to automatically install node modules
ENTRYPOINT ["/bin/bash", "-c", "if [[ ! -d node_modules ]]; then npm install; npm install -g mocha; npm install socket.io-client -g; fi; exec \"${@:0}\";"]
CMD ["npm", "start"]

# Run the tests and build, to make sure everything is working nicely
#RUN npm run build && npm run test

