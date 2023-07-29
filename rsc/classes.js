class CouldNotParseDiscordMessage extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CouldNotParseDiscordMessage.prototype);
    }
}
class InvalidMessageError extends Error {
    // Thrown when an <li> is empty of message content; empty <li>'s are common when 
    // copy-pasting discord messages.
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, InvalidMessageError.prototype);
    }
}
export class DiscordMessage {
    constructor(li) {
        var _a, _b;
        this.li = li;
        // Check if <li> empty => empty <li>'s are common when
        // copy-pasting Discord messages
        if (!((_a = li.firstElementChild) === null || _a === void 0 ? void 0 : _a.innerHTML)) {
            console.log(li);
            throw new InvalidMessageError("<li> seems to be empty");
        }
        // Parse the header, if one exists
        const messageHeader = li.querySelector("h3[class]^='header");
        if (messageHeader) {
            this.parseMessageHeader(messageHeader);
        }
        // Parse the message context; guaranteed to exist
        const resolvedRegexp = /(\d{18})-(\d{19})/.exec(li.id);
        if (resolvedRegexp && resolvedRegexp.length == 3) {
            this.context = {
                channelId: parseInt(resolvedRegexp[1]),
                messageId: parseInt(resolvedRegexp[2])
            };
        }
        else {
            console.log(li);
            throw new InvalidMessageError("messageId and serverId not found in <li> id");
        }
        // Parse the message content; guaranteed to exist
        // Only parse text content for now
        const messageFragments = [];
        const messageContentSpans = (_b = li.querySelector("div[id^='message-content']")) === null || _b === void 0 ? void 0 : _b.children;
        if (!messageContentSpans) {
            console.log(li);
            throw new InvalidMessageError("message contains no text content");
        }
        for (const messageContentSpan of Array.from(messageContentSpans)) {
            messageFragments.push(messageContentSpan.innerHTML);
        }
        this.content = {
            text: messageFragments.join('')
        };
    }
    parseMessageHeader(header) {
        var _a, _b, _c;
        // Guaranteed to exist if a message header exists
        const username = (_a = header.querySelector("span[class]^='username'")) === null || _a === void 0 ? void 0 : _a.textContent;
        const timeExact = (_b = header.querySelector("time")) === null || _b === void 0 ? void 0 : _b.dateTime; // Gets an exact timestamp
        const timeRelative = (_c = header.querySelector("time")) === null || _c === void 0 ? void 0 : _c.textContent; // Gets what's printed on the message; i.e. "Yesterday at 12:08"
        if (username && timeExact && timeRelative) {
            this.header = {
                username: username,
                timeExact: Date.parse(timeExact),
                timeRelative: timeRelative
            };
        }
        else {
            console.log(header);
            throw new CouldNotParseDiscordMessage("Message Header exists, but could not find username or time.");
        }
        // May or may not exist
        const avatar = header.querySelector("img[class]^='avatar'");
        if (avatar) {
            const avatarUrl = avatar.src;
            this.header.avatar = avatarUrl;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsYXNzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSwyQkFBNEIsU0FBUSxLQUFLO0lBQzNDLFlBQVksT0FBZ0I7UUFDeEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUNKO0FBQ0QsTUFBTSxtQkFBb0IsU0FBUSxLQUFLO0lBQ25DLGlGQUFpRjtJQUNqRixpQ0FBaUM7SUFFakMsWUFBWSxPQUFnQjtRQUN4QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFZixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDO0NBQ0o7QUFHRCxNQUFNLE9BQU8sY0FBYztJQW1CdkIsWUFBbUIsRUFBVzs7UUFBWCxPQUFFLEdBQUYsRUFBRSxDQUFTO1FBQzFCLHNEQUFzRDtRQUN0RCxnQ0FBZ0M7UUFDaEMsSUFBRyxDQUFDLENBQUMsTUFBQSxFQUFFLENBQUMsaUJBQWlCLDBDQUFFLFNBQVMsQ0FBQyxFQUFDO1lBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsTUFBTSxJQUFJLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUE7U0FDMUQ7UUFFRCxrQ0FBa0M7UUFDbEMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRTdELElBQUcsYUFBYSxFQUFDO1lBQ2IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzFDO1FBR0QsaURBQWlEO1FBQ2pELE1BQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFdkQsSUFBRyxjQUFjLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7WUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRztnQkFDWCxTQUFTLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekMsQ0FBQTtTQUNKO2FBQU07WUFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1NBQ2hGO1FBR0QsaURBQWlEO1FBQ2pELGtDQUFrQztRQUNsQyxNQUFNLGdCQUFnQixHQUFhLEVBQUUsQ0FBQztRQUN0QyxNQUFNLG1CQUFtQixHQUFHLE1BQUEsRUFBRSxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQywwQ0FBRSxRQUFRLENBQUM7UUFFckYsSUFBRyxDQUFDLG1CQUFtQixFQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsTUFBTSxJQUFJLG1CQUFtQixDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDckU7UUFFRCxLQUFJLE1BQU0sa0JBQWtCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDO1lBQzVELGdCQUFnQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2RDtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUNsQyxDQUFBO0lBQ0wsQ0FBQztJQUdPLGtCQUFrQixDQUFDLE1BQWU7O1FBQ3RDLGlEQUFpRDtRQUNqRCxNQUFNLFFBQVEsR0FBRyxNQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsMENBQUUsV0FBVyxDQUFDO1FBQzlFLE1BQU0sU0FBUyxHQUFHLE1BQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsMENBQUUsUUFBUSxDQUFDLENBQUUsMEJBQTBCO1FBQ3JGLE1BQU0sWUFBWSxHQUFHLE1BQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsMENBQUUsV0FBVyxDQUFDLENBQUUsZ0VBQWdFO1FBRWpJLElBQUcsUUFBUSxJQUFJLFNBQVMsSUFBSSxZQUFZLEVBQUM7WUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRztnQkFDVixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO2dCQUNoQyxZQUFZLEVBQUUsWUFBWTthQUM3QixDQUFBO1NBQ0o7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEIsTUFBTSxJQUFJLDJCQUEyQixDQUFDLDZEQUE2RCxDQUFDLENBQUM7U0FDeEc7UUFFRCx1QkFBdUI7UUFDdkIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBcUIsQ0FBQztRQUNoRixJQUFHLE1BQU0sRUFBQztZQUNOLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1NBQ2xDO0lBQ0wsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ291bGROb3RQYXJzZURpc2NvcmRNZXNzYWdlIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG5cbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIENvdWxkTm90UGFyc2VEaXNjb3JkTWVzc2FnZS5wcm90b3R5cGUpO1xuICAgIH1cbn1cbmNsYXNzIEludmFsaWRNZXNzYWdlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgLy8gVGhyb3duIHdoZW4gYW4gPGxpPiBpcyBlbXB0eSBvZiBtZXNzYWdlIGNvbnRlbnQ7IGVtcHR5IDxsaT4ncyBhcmUgY29tbW9uIHdoZW4gXG4gICAgLy8gY29weS1wYXN0aW5nIGRpc2NvcmQgbWVzc2FnZXMuXG5cbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlPzogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBJbnZhbGlkTWVzc2FnZUVycm9yLnByb3RvdHlwZSk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBEaXNjb3JkTWVzc2FnZSB7XG4gICAgcmVhZG9ubHkgY29udGV4dDoge1xuICAgICAgICBtZXNzYWdlSWQ6IG51bWJlcixcbiAgICAgICAgY2hhbm5lbElkOiBudW1iZXJcbiAgICB9O1xuXG4gICAgcmVhZG9ubHkgY29udGVudDoge1xuICAgICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICAgIGF0dGFjaG1lbnRzPzogc3RyaW5nW10gIC8vIGNvbnRhaW5zIFVSTCB0byBhdHRhY2htZW50XG4gICAgfTtcblxuICAgIGhlYWRlcj86IHtcbiAgICAgICAgdXNlcm5hbWU6IHN0cmluZyxcbiAgICAgICAgdGltZUV4YWN0OiBudW1iZXIsICAvLyB1bml4IHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgdGltZVJlbGF0aXZlOiBzdHJpbmcsXG4gICAgICAgIGF2YXRhcj86IHN0cmluZyAgLy8gdXJsXG4gICAgfTtcblxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGxpOiBFbGVtZW50KSB7XG4gICAgICAgIC8vIENoZWNrIGlmIDxsaT4gZW1wdHkgPT4gZW1wdHkgPGxpPidzIGFyZSBjb21tb24gd2hlblxuICAgICAgICAvLyBjb3B5LXBhc3RpbmcgRGlzY29yZCBtZXNzYWdlc1xuICAgICAgICBpZighKGxpLmZpcnN0RWxlbWVudENoaWxkPy5pbm5lckhUTUwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkTWVzc2FnZUVycm9yKFwiPGxpPiBzZWVtcyB0byBiZSBlbXB0eVwiKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFyc2UgdGhlIGhlYWRlciwgaWYgb25lIGV4aXN0c1xuICAgICAgICBjb25zdCBtZXNzYWdlSGVhZGVyID0gbGkucXVlcnlTZWxlY3RvcihcImgzW2NsYXNzXV49J2hlYWRlclwiKTtcbiAgICAgICAgXG4gICAgICAgIGlmKG1lc3NhZ2VIZWFkZXIpe1xuICAgICAgICAgICAgdGhpcy5wYXJzZU1lc3NhZ2VIZWFkZXIobWVzc2FnZUhlYWRlcik7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBtZXNzYWdlIGNvbnRleHQ7IGd1YXJhbnRlZWQgdG8gZXhpc3RcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRSZWdleHAgPSAvKFxcZHsxOH0pLShcXGR7MTl9KS8uZXhlYyhsaS5pZCk7XG4gICAgICAgIFxuICAgICAgICBpZihyZXNvbHZlZFJlZ2V4cCAmJiByZXNvbHZlZFJlZ2V4cC5sZW5ndGggPT0gMyl7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgY2hhbm5lbElkOiBwYXJzZUludChyZXNvbHZlZFJlZ2V4cFsxXSksXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiBwYXJzZUludChyZXNvbHZlZFJlZ2V4cFsyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkTWVzc2FnZUVycm9yKFwibWVzc2FnZUlkIGFuZCBzZXJ2ZXJJZCBub3QgZm91bmQgaW4gPGxpPiBpZFwiKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gUGFyc2UgdGhlIG1lc3NhZ2UgY29udGVudDsgZ3VhcmFudGVlZCB0byBleGlzdFxuICAgICAgICAvLyBPbmx5IHBhcnNlIHRleHQgY29udGVudCBmb3Igbm93XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VGcmFnbWVudHM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VDb250ZW50U3BhbnMgPSBsaS5xdWVyeVNlbGVjdG9yKFwiZGl2W2lkXj0nbWVzc2FnZS1jb250ZW50J11cIik/LmNoaWxkcmVuO1xuXG4gICAgICAgIGlmKCFtZXNzYWdlQ29udGVudFNwYW5zKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxpKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkTWVzc2FnZUVycm9yKFwibWVzc2FnZSBjb250YWlucyBubyB0ZXh0IGNvbnRlbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IoY29uc3QgbWVzc2FnZUNvbnRlbnRTcGFuIG9mIEFycmF5LmZyb20obWVzc2FnZUNvbnRlbnRTcGFucykpe1xuICAgICAgICAgICAgbWVzc2FnZUZyYWdtZW50cy5wdXNoKG1lc3NhZ2VDb250ZW50U3Bhbi5pbm5lckhUTUwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250ZW50ID0ge1xuICAgICAgICAgICAgdGV4dDogbWVzc2FnZUZyYWdtZW50cy5qb2luKCcnKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHBhcnNlTWVzc2FnZUhlYWRlcihoZWFkZXI6IEVsZW1lbnQpOiB2b2lkIHtcbiAgICAgICAgLy8gR3VhcmFudGVlZCB0byBleGlzdCBpZiBhIG1lc3NhZ2UgaGVhZGVyIGV4aXN0c1xuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGhlYWRlci5xdWVyeVNlbGVjdG9yKFwic3BhbltjbGFzc11ePSd1c2VybmFtZSdcIik/LnRleHRDb250ZW50O1xuICAgICAgICBjb25zdCB0aW1lRXhhY3QgPSBoZWFkZXIucXVlcnlTZWxlY3RvcihcInRpbWVcIik/LmRhdGVUaW1lOyAgLy8gR2V0cyBhbiBleGFjdCB0aW1lc3RhbXBcbiAgICAgICAgY29uc3QgdGltZVJlbGF0aXZlID0gaGVhZGVyLnF1ZXJ5U2VsZWN0b3IoXCJ0aW1lXCIpPy50ZXh0Q29udGVudDsgIC8vIEdldHMgd2hhdCdzIHByaW50ZWQgb24gdGhlIG1lc3NhZ2U7IGkuZS4gXCJZZXN0ZXJkYXkgYXQgMTI6MDhcIlxuICAgICAgICBcbiAgICAgICAgaWYodXNlcm5hbWUgJiYgdGltZUV4YWN0ICYmIHRpbWVSZWxhdGl2ZSl7XG4gICAgICAgICAgICB0aGlzLmhlYWRlciA9IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgdGltZUV4YWN0OiBEYXRlLnBhcnNlKHRpbWVFeGFjdCksXG4gICAgICAgICAgICAgICAgdGltZVJlbGF0aXZlOiB0aW1lUmVsYXRpdmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhlYWRlcik7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQ291bGROb3RQYXJzZURpc2NvcmRNZXNzYWdlKFwiTWVzc2FnZSBIZWFkZXIgZXhpc3RzLCBidXQgY291bGQgbm90IGZpbmQgdXNlcm5hbWUgb3IgdGltZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYXkgb3IgbWF5IG5vdCBleGlzdFxuICAgICAgICBjb25zdCBhdmF0YXIgPSBoZWFkZXIucXVlcnlTZWxlY3RvcihcImltZ1tjbGFzc11ePSdhdmF0YXInXCIpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICAgIGlmKGF2YXRhcil7XG4gICAgICAgICAgICBjb25zdCBhdmF0YXJVcmwgPSBhdmF0YXIuc3JjO1xuICAgICAgICAgICAgdGhpcy5oZWFkZXIuYXZhdGFyID0gYXZhdGFyVXJsO1xuICAgICAgICB9XG4gICAgfVxufSJdfQ==