// import * as fs from 'fs';
// import { SETTINGS } from 'main';
// export function writeDocumentToFile(doc: Document): void {
//     // Save document to a file
//     const serializer = new XMLSerializer();
//     const str = serializer.serializeToString(doc);
//     for(let i=0; i < 30; i++){
//         if(!fs.existsSync(`~/Documents/${i}.html`)){
//             fs.writeFile(`~/Documents/${i}.html`, str, () => {});
//             return;
//         }
//     }
// }
// export function writeStringToFile(str: string | undefined){
//     if(typeof str == "undefined"){
//         log("string undefined")
//         return;
//     }
//     for(let i=0; i < 30; i++){
//         if(!fs.existsSync(`${i}.html`)){
//             fs.writeFile(`${i}.html`, str, () => {});
//             return;
//         }
//     }
// }
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function log(...params: any[]): void{
// 	if(SETTINGS.debug){
//         console.log(...params);
// 	}
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw0QkFBNEI7QUFFNUIsbUNBQW1DO0FBR25DLDZEQUE2RDtBQUM3RCxpQ0FBaUM7QUFFakMsOENBQThDO0FBQzlDLHFEQUFxRDtBQUVyRCxpQ0FBaUM7QUFDakMsdURBQXVEO0FBQ3ZELG9FQUFvRTtBQUNwRSxzQkFBc0I7QUFDdEIsWUFBWTtBQUNaLFFBQVE7QUFDUixJQUFJO0FBRUosOERBQThEO0FBQzlELHFDQUFxQztBQUNyQyxrQ0FBa0M7QUFDbEMsa0JBQWtCO0FBQ2xCLFFBQVE7QUFFUixpQ0FBaUM7QUFDakMsMkNBQTJDO0FBQzNDLHdEQUF3RDtBQUN4RCxzQkFBc0I7QUFDdEIsWUFBWTtBQUNaLFFBQVE7QUFDUixJQUFJO0FBR0osaUVBQWlFO0FBQ2pFLCtDQUErQztBQUMvQyx1QkFBdUI7QUFDdkIsa0NBQWtDO0FBQ2xDLEtBQUs7QUFDTCxJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG4vLyBpbXBvcnQgeyBTRVRUSU5HUyB9IGZyb20gJ21haW4nO1xuXG5cbi8vIGV4cG9ydCBmdW5jdGlvbiB3cml0ZURvY3VtZW50VG9GaWxlKGRvYzogRG9jdW1lbnQpOiB2b2lkIHtcbi8vICAgICAvLyBTYXZlIGRvY3VtZW50IHRvIGEgZmlsZVxuXG4vLyAgICAgY29uc3Qgc2VyaWFsaXplciA9IG5ldyBYTUxTZXJpYWxpemVyKCk7XG4vLyAgICAgY29uc3Qgc3RyID0gc2VyaWFsaXplci5zZXJpYWxpemVUb1N0cmluZyhkb2MpO1xuXG4vLyAgICAgZm9yKGxldCBpPTA7IGkgPCAzMDsgaSsrKXtcbi8vICAgICAgICAgaWYoIWZzLmV4aXN0c1N5bmMoYH4vRG9jdW1lbnRzLyR7aX0uaHRtbGApKXtcbi8vICAgICAgICAgICAgIGZzLndyaXRlRmlsZShgfi9Eb2N1bWVudHMvJHtpfS5odG1sYCwgc3RyLCAoKSA9PiB7fSk7XG4vLyAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiB3cml0ZVN0cmluZ1RvRmlsZShzdHI6IHN0cmluZyB8IHVuZGVmaW5lZCl7XG4vLyAgICAgaWYodHlwZW9mIHN0ciA9PSBcInVuZGVmaW5lZFwiKXtcbi8vICAgICAgICAgbG9nKFwic3RyaW5nIHVuZGVmaW5lZFwiKVxuLy8gICAgICAgICByZXR1cm47XG4vLyAgICAgfVxuXG4vLyAgICAgZm9yKGxldCBpPTA7IGkgPCAzMDsgaSsrKXtcbi8vICAgICAgICAgaWYoIWZzLmV4aXN0c1N5bmMoYCR7aX0uaHRtbGApKXtcbi8vICAgICAgICAgICAgIGZzLndyaXRlRmlsZShgJHtpfS5odG1sYCwgc3RyLCAoKSA9PiB7fSk7XG4vLyAgICAgICAgICAgICByZXR1cm47XG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9XG5cblxuLy8gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbi8vIGV4cG9ydCBmdW5jdGlvbiBsb2coLi4ucGFyYW1zOiBhbnlbXSk6IHZvaWR7XG4vLyBcdGlmKFNFVFRJTkdTLmRlYnVnKXtcbi8vICAgICAgICAgY29uc29sZS5sb2coLi4ucGFyYW1zKTtcbi8vIFx0fVxuLy8gfSJdfQ==