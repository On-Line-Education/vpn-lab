export default function randomString(length: number) {
    // const chars =
    //     "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const chars = "abcdefghijklmnopqrstuvwxyz";
    // const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    var result = "";
    for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
