const AWS = require('aws-sdk');
const config = require('../../utils/config.js');

class StorageService {
    constructor() {
        this._S3 = new AWS.S3();
    }

    writeFile(file, meta) {
        const parameter = {
            Bucket: config.s3.bucketName, // Nama S3 Bucket yang digunakan
            Key: `${+new Date()}-${meta.filename}`, // Nama berkas yang akan disimpan
            Body: file._data, // Berkas (dalam bentuk Buffer) yang akan disimpan
            ContentType: meta.headers['content-type'], // MIME Type berkas yang akan disimpan
        };

        return new Promise((resolve, reject) => {
            this._S3.upload(parameter, (error, data) => {
                if (error) return reject(error);

                return resolve(data.Location);
            });
        });
    }
}

module.exports = StorageService;
