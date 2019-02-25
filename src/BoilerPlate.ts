import * as fs from 'fs';
import * as Path from 'path';
import chalk from "chalk";
import { TsLint, TsConfig, GitIgnore, Package } from './Files';
import { exec as execute, ChildProcess } from "child_process";

type Resolver<T> = (value: T) => void;
type Rejector = (error: Error) => void;

export default class BoilerPlate {
	public static async build(workingDirectory: string) : Promise<void> {
		try {
			await Promise.all([
				this.createFile(workingDirectory, 'tsconfig.json', TsConfig),
				this.createFile(workingDirectory, 'tslint.json', TsLint),
				this.createFile(workingDirectory, '.gitignore', GitIgnore),
				this.createDirectory(workingDirectory, 'src'),
				this.createDirectory(workingDirectory, 'dist'),
				this.createDirectory(workingDirectory, 'tests'),
				this.createFile(workingDirectory, 'package.json', await Package()),
			]);
			await Promise.all([
				this.execute("npm install"),
				this.execute("git init")
			]);
			this.log(chalk.green("Successfully created a basic typescript project!"));
			process.exit(1);
		} catch (error) {
			throw error;
		}
	}

	
	private static createDirectory(workingDirectory: string, filePath: string) : Promise<void> {
		const path : string = Path.join(workingDirectory, filePath);
		this.logDir(path);
		return new Promise((resolve : Resolver<void>, reject : Rejector) : void => {
			fs.stat(path, (error: Error, stats: fs.Stats) : void => {
				if (error) {
					this.makeDirectory(path, resolve, reject);
				}
				if (stats != null && stats.isDirectory()) {
					this.log(chalk.yellow(`Directory already exists: '${path}'`));
				}
			});
		});
	}
	
	private static makeDirectory(path: string, resolve : Resolver<void>, reject : Rejector) : void {
		fs.mkdir(path, (error: Error) : void => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	}
	
	private static createFile(workingDirectory: string, filePath: string, data : string) : Promise<void> {
		return new Promise((resolve : Resolver<void> , reject : Rejector) : void => {
			const path : string = Path.join(workingDirectory, filePath);
			this.logFile(path);
			fs.stat(path, (error : Error, stats: fs.Stats) : void => {
				if (error) {
					this.writeFile(path, data, resolve, reject);
				}
				if (stats != null && stats.isFile()) {
					this.log(chalk.yellow(`File already exists: '${path}'`));
				}
			});
		});
	}
	
	private static writeFile(path: string, data: string, resolve : Resolver<void>, reject : Rejector): void {
		fs.writeFile(path, data, (error : Error) : void => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	}
	
	private static async execute(command : string) : Promise<void> {
		return new Promise((resolve : Resolver<void>, reject : Rejector): void => {
			this.log(chalk.green(`executing command '${command}'`));
			const process : ChildProcess = execute(command);
			process.on('exit', () => {
				if (!process.killed) {
					process.kill();
				}
				this.log(chalk.green(`Successfully executed command: '${command}'`));
				resolve();
			});
			process.on('error', (error : Error) => {
				if (!process.killed) {
					process.kill();
				}
				this.log(chalk.red(`Failed to execute command: '${command}'`));
				reject(error);
			});
		});
	}

	private static logFile(path : string) : void {
		this.log(chalk.green(`Writing file: '${path}'`));
	}
	
	private static logDir(path : string) : void {
		this.log(chalk.green(`Making dir: '${path}'`));
	}

	private static log(data: string) : void {
		process.stdout.write(data + '\n');
	}
}