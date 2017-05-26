const crypto = require('crypto');

/**
 * @sha1加密模块 (加密固定,不可逆)
 * @param str string 要加密的字符串
 * @retrun string 加密后的字符串
 **/
const getSha1 = (str) => {
    const sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    const res = sha1.digest("hex");  //加密后的值d
    return res;
}

module.exports = {
  getSha1,
}
