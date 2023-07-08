import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe('Calculator Service', () => {
    
    it('should add two numbers', () => {
        const logger = new LoggerService();
        const calculatorService = new CalculatorService(logger);
        spyOn(logger, 'log');
        const result = calculatorService.add(2,2);
        expect(result).toBe(4, "unexpected add result");
        expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('should subtract two numbers', () => {
        const logger = new LoggerService();
        const calculatorService = new CalculatorService(logger);
        spyOn(logger, 'log');
        expect(calculatorService.subtract(3,2)).toBe(1, 'unexpected substraction result');
        expect(calculatorService.subtract(1,3)).toBe(-2, 'unexpected substraction result');
        expect(logger.log).toHaveBeenCalledTimes(2);
    });
});