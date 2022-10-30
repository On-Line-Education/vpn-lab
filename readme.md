VPN LAB
==

| npm command        | what it does                                       | command                                                                                                                         |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| serve              | start app                                          | npx vue-cli-service serve                                                                                                       |
| serve:production              | start app in production mode                                          | npx vue-cli-service build && npx serve -s dist/client -l 4000                                                                                                       |
| start              | start server                                       | npx ts-node server/index.ts                                                                                                     |
| dev:serve          | start app in development mode                      | npx vue-cli-service serve --mode development                                                                                    |
| dev:server         | start server with watcher                          | nodemon                                                                                                                         |
| dev                | shortcut for all dev: commands                     | npx concurrently \"npm run dev:server\" \"npm run dev:serve\"                                                                   |
| prisma:setup       | migrate migrations                                 | npx prisma migrate deploy                                                                                                       |
| prisma:setup:local | generate prisma client data and migrate migrations | npx prisma generate && npx prisma migrate deploy                                                                                |
| prisma:setup:dev   | migrate migrations                                 | npx prisma migrate deploy                                                                                                       |
| command            | run system command                                 | node ./server/Commands/command.cjs                                                                                              |
| dockerstart:local  | commands for local env docker                      | npm i && npm run prisma:setup:local && npm run command create:admin admin && npm run dev                                        |
| dockerstart:dev    | commands for dev env docker                        | npm i && npm run prisma:setup:dev && npm run command create:admin admin && concurrently \"npm run start\" \"npm run dev:serve\" |
| dockerstart:prod   | commands for prod env docker                       | npm i && npm run prisma:setup && concurrently \"npm run start\" \"npm run serve:production\"                                               |

Dev Setup
--
For developing run in the terminal <code>npm run dev</code>. It will report errors and logs for backend and frontend. Remember to set correct api url in client/config.js


Testing VPN Docker
--
Testing docker container command: <code>docker run -d --cap-add NET_ADMIN -p 500:500/udp -p 4500:4500/udp -p 1701:1701/tcp -p 1194:1194/udp -p 5555:5555/tcp -e SPW='!@#$%^&*' siomiz/softethervpn</code>

Install
--
To setup this project on your local env, you will need:
- Softether VPN
- MySQL database
- NodeJS v16+

Next you need to:
- Create <code>.env</code> file in project root dir and copy there content of <code>.env.example</code>
- Change data in <code>.env</code> so it is correct for your setup
- Run <code>npm install</code>
- Run <code>npm run prisma:setup</code>
- Now you can follow _Dev Setup_ section

Additional info
--
To access auth required query, assign user token to Authorization header
To access data from desktop app, you need to assign desktop_key token to Authorization header
You can use docker to setup this project
