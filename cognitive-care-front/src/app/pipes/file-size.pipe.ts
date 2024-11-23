import { Pipe, PipeTransform } from '@angular/core';

type unit = 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
type unitPrecisionMap = {
    [u in unit]: number;
};

const defaultPrecisionMap: unitPrecisionMap = {
    bytes: 0,
    KB: 0,
    MB: 1,
    GB: 1,
    TB: 2,
    PB: 2
};

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that can be a number or a map for each unit.
 * Usage:
 *   bytes | fileSize:precision
 * @example
 * // returns 1 KB
 * {{ 1500 | fileSize }}
 * @example
 * // returns 2.1 GB
 * {{ 2100000000 | fileSize }}
 * @example
 * // returns 1.46 KB
 * {{ 1500 | fileSize:2 }}
 */
@Pipe({
    name: 'fileSize',
    standalone: true
})
export class FileSizePipe implements PipeTransform {
    private readonly units: unit[] = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    transform(bytes = 0, precision: number | unitPrecisionMap = defaultPrecisionMap): string {
        if (Number.isNaN(Number.parseFloat(String(bytes))) || !Number.isFinite(bytes)) {
            return '?';
        }

        let unitIndex = 0;
        let bytesAux = bytes;
        while (bytesAux >= 1024) {
            bytesAux /= 1024;
            unitIndex++;
        }

        const unit = this.units[unitIndex];

        if (typeof precision === 'number') {
            return `${bytesAux.toFixed(+precision)} ${unit}`;
        }
        return `${bytesAux.toFixed(precision[unit])} ${unit}`;
    }
}