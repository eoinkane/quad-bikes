#!/bin/bash

# this is b/c pipenv stores the virtual env in a different
# directory so we need to get the path to it
SITE_PACKAGES=$(pipenv --venv)/lib/python3.8/site-packages
echo "Library Location: $SITE_PACKAGES"
DIR=$(pwd)

# Make sure pipenv is good to go
echo "Do fresh install to make sure everything is there"
pipenv install

# copy the file and it's store into the site SITE_PACKAGES
echo "Copy app and store into ${SITE_PACKAGES}"
cp app.py $SITE_PACKAGES/app.py

# zip up site packages
echo "Zipping up ${SITE_PACKAGES}"
cd $SITE_PACKAGES
zip -r9 $DIR/app.zip *

# remove the app and it's store from site packages
echo "Remove app and store from ${SITE_PACKAGES}"
rm app.py


cd $DIR
printf "Done\n Zip available at: ${DIR}/app.zip\n"
