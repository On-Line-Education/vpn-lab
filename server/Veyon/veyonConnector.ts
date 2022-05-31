import fetch from 'node-fetch';
require("dotenv").config({ path: __dirname + "/../../../.env" });

export default class VeyonConnector {
    private veyonHost: String

    constructor(){
        this.veyonHost = process.env.VEYON_HOST ?? "localhost";
    }

    public async getKeyPair() {

        let publicKey = await fetch(`http://${this.veyonHost}/veyon-keys.php?key=pub`);
        let privateKey = await fetch(`http://${this.veyonHost}/veyon-keys.php?key=priv`);
        await fetch(`http://${this.veyonHost}/veyon-keys.php?key=done`);

        let keypair = {
            pub: await publicKey.text(),
            priv: await privateKey.text(),
        };

        return keypair;
    }
}