vpn lab

| npm command | what it does                 | command                            |
| ----------- | ---------------------------- | ---------------------------------- |
| build       | build project                | npx tsc -b                         |
| start       | start built project          | node ./dist/index.js               |
| dev         | build project on file change | npx tsc -w                         |
| rundev      | run project on build update  | nodemon                            |
| br          | build project and run        | npx tsc -b && node ./dist/index.js |

For developing run in first one terminal <code>npm run dev</code> and in second one <code>npm run rundev</code>. First terminal will report errors on compilation and second one will show server output.

Testing docker container command: <code>docker run -d --cap-add NET_ADMIN -p 500:500/udp -p 4500:4500/udp -p 1701:1701/tcp -p 1194:1194/udp -p 5555:5555/tcp -e SPW='!@#$%^&*' siomiz/softethervpn</code>