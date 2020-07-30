source ./colors.sh

echo -e "$BLUE Preparing e-Potek :] $RESET_FORMATTING"

bash setup-root.sh

# Setup all microservices
for APP in 'admin' 'app' 'pro' 'www2' 'backend'
  do
    bash setup-microservice.sh $APP
  done
