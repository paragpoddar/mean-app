import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

/**
 *
 * Will have the task of getting the value of control, which will be a file.
 * then read that using a file reader again and then checking for the mime type of
 * that file.
 *
 */

export const mimeType = (control: AbstractControl):
    Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    if (typeof (control)) {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const fileReaderObservable = Observable.create((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener('loadend', () => {

            /**
             * This creates a new array of 8 bit unsigned integers.
             * You can just think of this as a way that allows us
             * to access or to read certain patterns in the file and
             * not just in the file but also in the form metadata that
             * we can then use to parse the mime type because we don't
             * just want to check the file extension because you could upload a pdf file
             * as a jpeg file. We want to really infer that file type by looking into that file
             * and that Uint8Array allow us to do this. That is also why we read this in as an
             *  array buffer because we can easily convert this to such a you
             */
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                case '89504e47':
                    isValid = true;
                    break;
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                case 'ffd8ffe3':
                case 'ffd8ffe8':
                    isValid = true;
                    break;
                default:
                    isValid = false; // Or you can use the blob.type as fallback
                    break;
            }
            if (isValid) {
                observer.next(null);
            } else {
                observer.next({ invalidMimeType: true });
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file); // This will allow us to access mime type
    });
    return fileReaderObservable;
};
