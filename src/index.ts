#!/usr/bin/env node
import chalk from "chalk";
import * as clear from "clear";
import * as figlet from "figlet";
import * as program from "commander";
import BoilerPlate from "./BoilerPlate";

type Resolver<T> = (value: T) => void;
type Rejector = (error: Error) => void;

program
	.version('0.0.1')
	.description('A CLI for quickly building collate typescript apps');

program
	.command('create')
	.alias('c')
	.description('Creates a basic TypeScipt project.')
	.action(async () => {
		await printTitle();
		await BoilerPlate.build(process.cwd());
	});

function printTitle() : Promise<void> {
	return new Promise((resolve: Resolver<void>, reject: Rejector) : void => {
		clear();
		try {
			figlet.text('Collate\nTemplate', {
				horizontalLayout: "fitted"
			}, (error : Error | null, text : string | undefined) : void => {
				printFigletText(error, text, resolve);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function printFigletText(error: Error | null, text : string | undefined, resolve : Resolver<void>): void {
	if (error) {
		throw error;
	}
	if (text) {
		process.stdout.write(chalk.magentaBright(text) + "\n");
		resolve();
	}
}

const ArgSize : number = 2;
if(!process.argv.slice(ArgSize).length) {
    program.outputHelp();
    process.exit();
}
program.parse(process.argv);


