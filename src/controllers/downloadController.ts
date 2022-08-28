import {EventEmitter} from 'events';
import express from 'express';
import fs from 'fs';
import {Worker} from 'worker_threads';
import APIError from '../classes/APIError.js';
import handleRequestValidationErrors from '../tools/handleRequestValidationErrors.js';


export default class downloadController {
	private static cache = new Map<string, { path: string, timer: NodeJS.Timer }>();
	private static queue = new Map<string, NodeJS.EventEmitter>();

	static async soundCloud() {
	}

	static async youtube(req: express.Request, res: express.Response) {
		if (handleRequestValidationErrors(req, res))
			return;

		const videoID = decodeURI(req.query.audioID.toString());
		const streamRes = () => {
			const video = downloadController.cache.get(videoID);
			fs.createReadStream(video.path).pipe(res);
		};

		if (downloadController.cache.has(videoID))
			return streamRes();

		if (downloadController.queue.has(videoID))
			return downloadController.queue.get(videoID).on('downloaded', () => {
				streamRes();
			});

		downloadController.queue.set(videoID, new EventEmitter());

		try {
			const videoPath = await new Promise<string>((resolve, reject) => {
				const workerData: Workers.WorkerData.DownloadAudio = {
					videoID
				};

				const worker = new Worker('./dist/src/workers/download-audio', {
					workerData
				});

				worker.on('error', err => {
					reject(err);
				});

				worker.on('messageerror', err => {
					reject(err);
				});

				worker.on('exit', code => {
					if (code !== 0)
						reject('worker stopped with exit code: ' + code);
				});

				worker.on('message', (msg: Workers.ParentPort.DownloadAudio) => {
					switch (msg.type) {
						case 'end':
							downloadController.cache.set(videoID, {
								path: msg.path,
								timer: setTimeout(() => {
									downloadController.cache.delete(videoID);
								}, 1000 * 60 * 60 * 24)
							});

							downloadController.queue.get(videoID).emit('downloaded');
							downloadController.queue.delete(videoID);

							resolve(msg.path);
							break;
						case 'error':
							reject(msg.error);
							break;
					}
				});
			});

			fs.createReadStream(videoPath).pipe(res);
		} catch (err) {
			// todo: implement error status for incorrect id
			// msg 'Streaming data not available.'
			res.status(500).send(new APIError(500, [err.message], 'INTERNAL_ERROR'));
		}
	}
}