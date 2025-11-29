export const routes = {
    send: (token = "") => token ? `/send/${token}` : `/send`,
    token: (token = "") => token ? `/token/${token}` : `/token`,
    cryptopin: (token = "") => token ? `/cryptopin/${token}` : `/cryptopin`,
    receive: (token = "") => token ? `/receive/${token}` : `/receive`,
    trade: "/swap",
    topup: "/topup",
}