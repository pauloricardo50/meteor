bash setup.sh

# Setup all microservices
for APP in 'admin' 'app' 'pro' 'www' 'www2' 'backend'
  do
    bash setup-microservice.sh $APP
  done
