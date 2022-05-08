VPN LAB
==

| npm command        | what it does                             | command                                                                    |
| ------------------ | ---------------------------------------- | -------------------------------------------------------------------------- |
| build              | build project                            | npx tsc -b                                                                 |
| start              | start built project                      | node ./dist/index.js                                                       |
| dev:server:builder | build project on file change             | npx tsc -w                                                                 |
| dev:server:watcher | run project on build update              | nodemon                                                                    |
| build:start        | build project and run                    | npx tsc -b && node ./dist/index.js                                         |
| dev                | run builder and watcher in the same time | npx concurrently "npm run dev:server:watcher" "npm run dev:server:builder" |
| dev:serve          | run builder and watcher for frontend     | npx vue-cli-service serve --mode development                               |
| serve              | run frontend dev server                  | npx vue-clu-service serve                                                  |

Dev Setup
--
For developing run in the first terminal tab <code>npm run dev</code> and in the second one <code>npm run dev:serve</code>. First terminal tab will report errors and log for backend and the second one will show output for frontend dev server.


Testing VPN Docker
--
Testing docker container command: <code>docker run -d --cap-add NET_ADMIN -p 500:500/udp -p 4500:4500/udp -p 1701:1701/tcp -p 1194:1194/udp -p 5555:5555/tcp -e SPW='!@#$%^&*' siomiz/softethervpn</code>

Install
--
To setup this project on your local env, you will need:
- Softether VPN
- MySql database
- NodeJS

Next you need to:
- Create <code>.env</code> file in project root dir and copy there content of <code>.env.example</code>
- Change data in <code>.env</code> so it is correct for your setup
- Run <code>npm install</code>
- Run <code>npx prisma migrate dev</code>
- You can run <code>npx prisma db seed</code> to seed database and VPN IF <code>npx prisma migrate dev</code> didn't seed it (Warning: you shouldn't run it more than one, also it can crash while seeding vpn after db part is done)
- Now you can follow _Dev Setup_ section

Additional info
--
To access auth required query, assign user token to Authorization header
To access data from desktop app, you need to assign desktop_key token to Authorization header