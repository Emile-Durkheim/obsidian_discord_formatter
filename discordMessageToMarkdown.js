import { log } from 'utils';
export default function discordMessageToMarkdown(event) {
    var _a, _b, _c;
    // Check that there is data in clipboardEvent
    if (!event.clipboardData) {
        log("clipboardData empty");
        return;
    }
    // Parse clipboardEvent into a Document if possible
    var messageDOM = clipboardToDocument(event.clipboardData);
    if (!messageDOM) {
        log("No HTML in paste");
        return;
    }
    // Ensure it's a Discord message
    if (!isDiscordMessage(messageDOM)) {
        log("Not a Discord message");
        return;
    }
    // Parse message to markdown
    // That children exist was already ensured by isDiscordMessage()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var messageDivs = Array.from(messageDOM.body.firstElementChild.children);
    var markdown = [];
    for (var _i = 0, messageDivs_1 = messageDivs; _i < messageDivs_1.length; _i++) {
        var messageDiv = messageDivs_1[_i];
        // Parse the header that contains username/time if it exists on the message
        var messageHeader = messageDiv.querySelector("h3");
        if (messageHeader) {
            var username = (_a = messageHeader.querySelector("span > span")) === null || _a === void 0 ? void 0 : _a.textContent;
            var time = (_b = messageHeader.querySelector("time")) === null || _b === void 0 ? void 0 : _b.textContent;
            if (!(username && time)) {
                throw new Error("Couldn't get username or time.");
            }
            markdown.push(">**".concat(username).concat(time, "**"));
        }
        // Parse the message
        // no-non-null-assertion: Assured to be non-null by HTML structure of Discord message
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var messageFragments = [];
        var messageContentSpans = (_c = messageDiv.querySelector("div[id*='message-content']")) === null || _c === void 0 ? void 0 : _c.children;
        if (messageContentSpans === undefined) {
            log("Contains no message: ", messageDiv);
            continue;
        }
        for (var _d = 0, _e = Array.from(messageContentSpans); _d < _e.length; _d++) {
            var messageContentSpan = _e[_d];
            messageFragments.push(messageContentSpan.innerHTML);
        }
        // Push the message to our markdown
        markdown.push(">".concat(messageFragments.join('')));
    }
    log(markdown.join('\n'));
    return markdown.join('\n');
}
function isDiscordMessage(doc) {
    // Checks whether the message has a few hallmarks of a Discord DOM, i.e.:
    // First child of body is an OL with the properties:
    // class="scrollInner-xxxxx", dataset-list-id="chat-messages", and an <li> child
    //
    // Should probably be made more robust in the future; could imagine this would catch Slack messages too... 
    var _a, _b, _c;
    if (((_b = (_a = doc.body) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.nodeName) != 'OL') {
        return false;
    }
    // Line above already ensures that <ol> exists
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var ol = doc.body.firstElementChild;
    return (ol.dataset.listId == "chat-messages" &&
        /scrollerInner-.{6}/.test(ol.className) &&
        ((_c = ol.firstElementChild) === null || _c === void 0 ? void 0 : _c.nodeName) == 'LI');
}
function clipboardToDocument(clipboardData) {
    var rawHTML = clipboardData.getData('text/html');
    if (!rawHTML) {
        return;
    }
    var parser = new DOMParser();
    var messageDOM = parser.parseFromString(rawHTML, 'text/html');
    return messageDOM;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29yZE1lc3NhZ2VUb01hcmtkb3duLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlzY29yZE1lc3NhZ2VUb01hcmtkb3duLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFFNUIsTUFBTSxDQUFDLE9BQU8sVUFBVSx3QkFBd0IsQ0FBQyxLQUFxQjs7SUFDbEUsNkNBQTZDO0lBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDO1FBQ3JCLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1FBQzFCLE9BQU87S0FDVjtJQUVELG1EQUFtRDtJQUNuRCxJQUFNLFVBQVUsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUQsSUFBRyxDQUFDLFVBQVUsRUFBQztRQUNYLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3hCLE9BQU87S0FDVjtJQUVELGdDQUFnQztJQUNoQyxJQUFHLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUM7UUFDN0IsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDN0IsT0FBTztLQUNWO0lBRUQsNEJBQTRCO0lBRTVCLGdFQUFnRTtJQUNoRSxvRUFBb0U7SUFDcEUsSUFBTSxXQUFXLEdBQWMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGlCQUFrQixDQUFDLFFBQVMsQ0FBQyxDQUFDO0lBQ3hGLElBQU0sUUFBUSxHQUFhLEVBQUUsQ0FBQztJQUU5QixLQUF3QixVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVcsRUFDbkM7UUFESSxJQUFNLFVBQVUsb0JBQUE7UUFFaEIsMkVBQTJFO1FBQzNFLElBQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFckQsSUFBRyxhQUFhLEVBQUM7WUFDYixJQUFNLFFBQVEsR0FBRyxNQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLDBDQUFFLFdBQVcsQ0FBQztZQUN6RSxJQUFNLElBQUksR0FBRyxNQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLDBDQUFFLFdBQVcsQ0FBQztZQUU5RCxJQUFHLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEVBQUM7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzthQUNyRDtZQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBTSxRQUFRLFNBQUcsSUFBSSxPQUFJLENBQUMsQ0FBQztTQUM1QztRQUdELG9CQUFvQjtRQUNwQixxRkFBcUY7UUFDckYsb0VBQW9FO1FBQ3BFLElBQU0sZ0JBQWdCLEdBQWEsRUFBRSxDQUFDO1FBQ3RDLElBQU0sbUJBQW1CLEdBQUcsTUFBQSxVQUFVLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLDBDQUFFLFFBQVEsQ0FBQztRQUU3RixJQUFHLG1CQUFtQixLQUFLLFNBQVMsRUFBQztZQUNqQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekMsU0FBUztTQUNaO1FBRUQsS0FBZ0MsVUFBK0IsRUFBL0IsS0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQS9CLGNBQStCLEVBQS9CLElBQStCLEVBQUM7WUFBNUQsSUFBTSxrQkFBa0IsU0FBQTtZQUN4QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdkQ7UUFFRCxtQ0FBbUM7UUFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLENBQUM7S0FDbEQ7SUFFRCxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBR0QsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFhO0lBQ25DLHlFQUF5RTtJQUN6RSxvREFBb0Q7SUFDcEQsZ0ZBQWdGO0lBQ2hGLEVBQUU7SUFDRiwyR0FBMkc7O0lBRTlHLElBQUcsQ0FBQSxNQUFBLE1BQUEsR0FBRyxDQUFDLElBQUksMENBQUUsVUFBVSwwQ0FBRSxRQUFRLEtBQUksSUFBSSxFQUN0QztRQUNGLE9BQU8sS0FBSyxDQUFDO0tBQ2I7SUFFRSw4Q0FBOEM7SUFDakQsb0VBQW9FO0lBQ3BFLElBQU0sRUFBRSxHQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQyxDQUFDO0lBRWhFLE9BQU8sQ0FDUixFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxlQUFlO1FBQzNCLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO1FBQ3ZDLENBQUEsTUFBQSxFQUFFLENBQUMsaUJBQWlCLDBDQUFFLFFBQVEsS0FBSSxJQUFJLENBQ3RDLENBQUE7QUFDWixDQUFDO0FBR0QsU0FBUyxtQkFBbUIsQ0FBQyxhQUEyQjtJQUN2RCxJQUFNLE9BQU8sR0FBdUIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVwRSxJQUFHLENBQUMsT0FBTyxFQUFDO1FBQ1IsT0FBTztLQUNWO0lBRUosSUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUMvQixJQUFNLFVBQVUsR0FBYSxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUUxRSxPQUFPLFVBQVUsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9nIH0gZnJvbSAndXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaXNjb3JkTWVzc2FnZVRvTWFya2Rvd24oZXZlbnQ6IENsaXBib2FyZEV2ZW50KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAvLyBDaGVjayB0aGF0IHRoZXJlIGlzIGRhdGEgaW4gY2xpcGJvYXJkRXZlbnRcbiAgICBpZiAoIWV2ZW50LmNsaXBib2FyZERhdGEpe1xuICAgICAgICBsb2coXCJjbGlwYm9hcmREYXRhIGVtcHR5XCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgLy8gUGFyc2UgY2xpcGJvYXJkRXZlbnQgaW50byBhIERvY3VtZW50IGlmIHBvc3NpYmxlXG4gICAgY29uc3QgbWVzc2FnZURPTSA9IGNsaXBib2FyZFRvRG9jdW1lbnQoZXZlbnQuY2xpcGJvYXJkRGF0YSk7XG4gICAgaWYoIW1lc3NhZ2VET00pe1xuICAgICAgICBsb2coXCJObyBIVE1MIGluIHBhc3RlXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIGl0J3MgYSBEaXNjb3JkIG1lc3NhZ2VcbiAgICBpZighaXNEaXNjb3JkTWVzc2FnZShtZXNzYWdlRE9NKSl7XG4gICAgICAgIGxvZyhcIk5vdCBhIERpc2NvcmQgbWVzc2FnZVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIG1lc3NhZ2UgdG8gbWFya2Rvd25cblxuICAgIC8vIFRoYXQgY2hpbGRyZW4gZXhpc3Qgd2FzIGFscmVhZHkgZW5zdXJlZCBieSBpc0Rpc2NvcmRNZXNzYWdlKClcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgIGNvbnN0IG1lc3NhZ2VEaXZzOiBFbGVtZW50W10gPSBBcnJheS5mcm9tKG1lc3NhZ2VET00uYm9keS5maXJzdEVsZW1lbnRDaGlsZCEuY2hpbGRyZW4hKTtcbiAgICBjb25zdCBtYXJrZG93bjogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvcihjb25zdCBtZXNzYWdlRGl2IG9mIG1lc3NhZ2VEaXZzKVxuICAgIHtcbiAgICAgICAgLy8gUGFyc2UgdGhlIGhlYWRlciB0aGF0IGNvbnRhaW5zIHVzZXJuYW1lL3RpbWUgaWYgaXQgZXhpc3RzIG9uIHRoZSBtZXNzYWdlXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VIZWFkZXIgPSBtZXNzYWdlRGl2LnF1ZXJ5U2VsZWN0b3IoXCJoM1wiKTtcblxuICAgICAgICBpZihtZXNzYWdlSGVhZGVyKXtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lID0gbWVzc2FnZUhlYWRlci5xdWVyeVNlbGVjdG9yKFwic3BhbiA+IHNwYW5cIik/LnRleHRDb250ZW50O1xuICAgICAgICAgICAgY29uc3QgdGltZSA9IG1lc3NhZ2VIZWFkZXIucXVlcnlTZWxlY3RvcihcInRpbWVcIik/LnRleHRDb250ZW50O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZighKHVzZXJuYW1lICYmIHRpbWUpKXtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBnZXQgdXNlcm5hbWUgb3IgdGltZS5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hcmtkb3duLnB1c2goYD4qKiR7dXNlcm5hbWV9JHt0aW1lfSoqYCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAvLyBQYXJzZSB0aGUgbWVzc2FnZVxuICAgICAgICAvLyBuby1ub24tbnVsbC1hc3NlcnRpb246IEFzc3VyZWQgdG8gYmUgbm9uLW51bGwgYnkgSFRNTCBzdHJ1Y3R1cmUgb2YgRGlzY29yZCBtZXNzYWdlXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VGcmFnbWVudHM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VDb250ZW50U3BhbnMgPSBtZXNzYWdlRGl2LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbaWQqPSdtZXNzYWdlLWNvbnRlbnQnXVwiKT8uY2hpbGRyZW47XG5cbiAgICAgICAgaWYobWVzc2FnZUNvbnRlbnRTcGFucyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGxvZyhcIkNvbnRhaW5zIG5vIG1lc3NhZ2U6IFwiLCBtZXNzYWdlRGl2KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yKGNvbnN0IG1lc3NhZ2VDb250ZW50U3BhbiBvZiBBcnJheS5mcm9tKG1lc3NhZ2VDb250ZW50U3BhbnMpKXtcbiAgICAgICAgICAgIG1lc3NhZ2VGcmFnbWVudHMucHVzaChtZXNzYWdlQ29udGVudFNwYW4uaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFB1c2ggdGhlIG1lc3NhZ2UgdG8gb3VyIG1hcmtkb3duXG4gICAgICAgIG1hcmtkb3duLnB1c2goYD4ke21lc3NhZ2VGcmFnbWVudHMuam9pbignJyl9YCk7XG4gICAgfVxuXG4gICAgbG9nKG1hcmtkb3duLmpvaW4oJ1xcbicpKTtcbiAgICByZXR1cm4gbWFya2Rvd24uam9pbignXFxuJyk7XG59XG5cblxuZnVuY3Rpb24gaXNEaXNjb3JkTWVzc2FnZShkb2M6IERvY3VtZW50KXtcbiAgICAvLyBDaGVja3Mgd2hldGhlciB0aGUgbWVzc2FnZSBoYXMgYSBmZXcgaGFsbG1hcmtzIG9mIGEgRGlzY29yZCBET00sIGkuZS46XG4gICAgLy8gRmlyc3QgY2hpbGQgb2YgYm9keSBpcyBhbiBPTCB3aXRoIHRoZSBwcm9wZXJ0aWVzOlxuICAgIC8vIGNsYXNzPVwic2Nyb2xsSW5uZXIteHh4eHhcIiwgZGF0YXNldC1saXN0LWlkPVwiY2hhdC1tZXNzYWdlc1wiLCBhbmQgYW4gPGxpPiBjaGlsZFxuICAgIC8vXG4gICAgLy8gU2hvdWxkIHByb2JhYmx5IGJlIG1hZGUgbW9yZSByb2J1c3QgaW4gdGhlIGZ1dHVyZTsgY291bGQgaW1hZ2luZSB0aGlzIHdvdWxkIGNhdGNoIFNsYWNrIG1lc3NhZ2VzIHRvby4uLiBcblxuXHRpZihkb2MuYm9keT8uZmlyc3RDaGlsZD8ubm9kZU5hbWUgIT0gJ09MJylcbiAgICB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG4gICAgXG4gICAgLy8gTGluZSBhYm92ZSBhbHJlYWR5IGVuc3VyZXMgdGhhdCA8b2w+IGV4aXN0c1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuXHRjb25zdCBvbDogSFRNTEVsZW1lbnQgPSBkb2MuYm9keS5maXJzdEVsZW1lbnRDaGlsZCEgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICByZXR1cm4gKFxuXHRcdFx0b2wuZGF0YXNldC5saXN0SWQgPT0gXCJjaGF0LW1lc3NhZ2VzXCIgJiYgXG4gICAgICAgICAgICAvc2Nyb2xsZXJJbm5lci0uezZ9Ly50ZXN0KG9sLmNsYXNzTmFtZSkgJiZcbiAgICAgICAgICAgIG9sLmZpcnN0RWxlbWVudENoaWxkPy5ub2RlTmFtZSA9PSAnTEknXG4gICAgICAgICAgIClcbn1cblxuXG5mdW5jdGlvbiBjbGlwYm9hcmRUb0RvY3VtZW50KGNsaXBib2FyZERhdGE6IERhdGFUcmFuc2Zlcik6IERvY3VtZW50IHwgdW5kZWZpbmVkIHtcblx0Y29uc3QgcmF3SFRNTDogc3RyaW5nIHwgdW5kZWZpbmVkID0gY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L2h0bWwnKTtcbiAgICBcbiAgICBpZighcmF3SFRNTCl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cblx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuXHRjb25zdCBtZXNzYWdlRE9NOiBEb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmF3SFRNTCwgJ3RleHQvaHRtbCcpO1xuXG5cdHJldHVybiBtZXNzYWdlRE9NO1xufSJdfQ==