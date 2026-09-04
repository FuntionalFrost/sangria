import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
	ListObjectsV2Command,
	CreateBucketCommand,
	HeadBucketCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getEnv } from '../core/env';

class SangriaStorage {
	private client: S3Client | null = null;
	private bucketName: string;

	constructor() {
		this.bucketName = getEnv('S3_BUCKET', 'sangria-media');
	}

	private getClient(): S3Client {
		if (!this.client) {
			this.client = new S3Client({
				region: getEnv('S3_REGION', 'us-east-1'),
				endpoint: getEnv('S3_ENDPOINT', 'http://localhost:9000'),
				forcePathStyle: getEnv('S3_FORCE_PATH_STYLE', 'true') === 'true',
				credentials: {
					accessKeyId: getEnv('S3_ACCESS_KEY', 'minioadmin'),
					secretAccessKey: getEnv('S3_SECRET_KEY', 'minioadminpassword')
				}
			});
		}
		return this.client;
	}

	async ensureBucket(): Promise<void> {
		const s3 = this.getClient();
		try {
			await s3.send(new HeadBucketCommand({ Bucket: this.bucketName }));
		} catch {
			try {
				await s3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
				console.log(`[Sangria Storage] Created S3 bucket: ${this.bucketName}`);
			} catch (createErr) {
				console.warn(`[Sangria Storage] Could not auto-create bucket:`, createErr);
			}
		}
	}

	async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
		const s3 = this.getClient();
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			ContentType: contentType
		});
		return await getSignedUrl(s3, command, { expiresIn });
	}

	async getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
		const s3 = this.getClient();
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key
		});
		return await getSignedUrl(s3, command, { expiresIn });
	}

	async deleteFile(key: string): Promise<void> {
		const s3 = this.getClient();
		await s3.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
	}

	async listFiles(
		prefix = '',
		maxKeys = 100
	): Promise<Array<{ key: string; size: number; lastModified?: Date }>> {
		const s3 = this.getClient();
		try {
			const response = await s3.send(
				new ListObjectsV2Command({
					Bucket: this.bucketName,
					Prefix: prefix,
					MaxKeys: maxKeys
				})
			);
			return (
				response.Contents?.map((item) => ({
					key: item.Key || '',
					size: item.Size || 0,
					lastModified: item.LastModified
				})) || []
			);
		} catch {
			return [];
		}
	}
}

export const storage = new SangriaStorage();
