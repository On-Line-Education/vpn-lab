FROM webdevops/php-nginx:7.4 
#https://dockerfile.readthedocs.io/en/latest/content/DockerImages/dockerfiles/php-nginx.html
COPY ./veyon-keys.php /app/
RUN apt update && wget https://github.com/veyon/veyon/releases/download/v4.7.3/veyon_4.7.3.0-debian.buster_amd64.deb && apt -y install ./veyon_4.7.3.0-debian.buster_amd64.deb sudo
RUN echo "application ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/php
RUN chmod 0440 /etc/sudoers.d/php
