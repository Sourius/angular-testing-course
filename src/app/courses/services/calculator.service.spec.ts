import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe('Calculator Service', () => {
    let calculator: CalculatorService;
    let loggerSpy: LoggerService;

    beforeEach(() => {
        console.log("Start before each")
        // spyOn(logger, 'log');
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
        
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {
                    provide: LoggerService,
                    useValue: loggerSpy
                }
            ]
        });

        // calculator = new CalculatorService(loggerSpy);
        calculator = TestBed.inject(CalculatorService);

        console.log("End before each")
    });

    it('should add two numbers', () => {
        console.log("Start add two numbers")
        const result = calculator.add(2, 2);
        expect(result).toBe(4, "unexpected add result");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
        console.log("End add two numbers")
    });

    it('should subtract two numbers', () => {
        console.log("Start subtract two numbers")
        expect(calculator.subtract(3, 2)).toBe(1, 'unexpected substraction result');
        expect(calculator.subtract(1, 3)).toBe(-2, 'unexpected substraction result');
        expect(loggerSpy.log).toHaveBeenCalledTimes(2);
        console.log("End subtract two numbers")
    });
});