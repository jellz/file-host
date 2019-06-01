#!/bin/sh
ssh-keygen -t rsa -b 4096 -f jwt.key
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub

