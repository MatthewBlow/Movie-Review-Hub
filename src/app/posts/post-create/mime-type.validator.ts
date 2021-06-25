import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

// Function to identify and validate the image file from a post
export const mimeType = (control: AbstractControl
  ): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    // Verify that file is not a text file
    if(typeof(control.value) === 'string'){
      return of(null);
    }
    // Assigning file
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObservable = Observable.create((observer: Observer<{[key: string]: any}>) => {
      // Add listener to file reader
      fileReader.addEventListener("loadend", () => {
        // Storing the mime type value into a constant
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header= ""
        let isValid= false;
        // Retrieve the file type by reading the 'arr' constant through a for loop
        for(let i = 0; i < arr.length; i++){
          // Assigning the value
          header += arr[i].toString(16);
        }
        // Switch statement to check if the file pattern from array matches verified file type
        switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        // Check if mime type is valid, return the observable
        if(isValid) {
          observer.next(null);
        } else {
          observer.next({invalidMimeType: true});
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    });
    return frObservable;
};
