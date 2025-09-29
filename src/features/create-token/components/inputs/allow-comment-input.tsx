// import { useFormContext } from "react-hook-form";
// import type { VideoFormData } from "../../schema";
// import { Switch } from "@worldcoin/mini-apps-ui-kit-react";
// import { useState } from "react";

// const ChatIcon = () => {
// 	return (
// 		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
// 			<path fillRule="evenodd" clipRule="evenodd" d="M15.2174 3.08105H8.69237C7.45636 3.08105 6.4063 3.89915 6.06912 5.02243C6.03855 5.12427 6.11786 5.22272 6.2242 5.22272H11.8174C13.9007 5.22272 15.6007 6.92272 15.6007 9.01441V12.8066C15.6007 12.9077 15.6902 12.9858 15.7891 12.965C17.0294 12.7042 17.959 11.5985 17.959 10.2811V5.82272C17.959 4.31439 16.7257 3.08105 15.2174 3.08105Z" fill="#23262F" />
// 			<path fillRule="evenodd" clipRule="evenodd" d="M10.3753 12.2225C9.90034 12.2225 9.51701 11.8391 9.51701 11.3641C9.51701 10.8891 9.90034 10.4975 10.3753 10.4975C10.8503 10.4975 11.242 10.8891 11.242 11.3641C11.242 11.8391 10.8503 12.2225 10.3753 12.2225ZM6.47533 12.2225C6.00033 12.2225 5.60866 11.8391 5.60866 11.3641C5.60866 10.8891 6.00033 10.4975 6.47533 10.4975C6.95033 10.4975 7.33366 10.8891 7.33366 11.3641C7.33366 11.8391 6.95033 12.2225 6.47533 12.2225ZM11.817 6.26416H5.29199C3.77533 6.26416 2.54199 7.49749 2.54199 9.01413V13.4725C2.54199 14.9808 3.77533 16.2141 5.29199 16.2141H5.97533C6.29199 16.2141 6.59199 16.3391 6.81699 16.5641L7.73366 17.4808C7.95033 17.6975 8.24199 17.8225 8.55034 17.8225C8.85868 17.8225 9.15034 17.6975 9.37534 17.4808L10.292 16.5641C10.5087 16.3391 10.8087 16.2141 11.1253 16.2141H11.817C13.3253 16.2141 14.5587 14.9808 14.5587 13.4725V9.01413C14.5587 7.49749 13.3253 6.26416 11.817 6.26416Z" fill="#23262F" />
// 		</svg>
// 	)
// }

// export function AllowCommentInput() {
// 	const {
// 		setValue,
// 		watch
// 	} = useFormContext<VideoFormData>();
// 	const allowComments = watch("allowComments");
// 	const [isEnabled, setIsEnabled] = useState(allowComments);
// 	// Function to handle tag selection
// 	// console.log("Selected Tags:", selectedTags);
// 	return (
// 		<div className="">
// 			<div className="flex justify-between items-center">
// 				<div className="flex justify-center items-center gap-2">
// 					<ChatIcon />
// 					<div className="text-[14px] not-italic font-medium leading-[20px] tracking-[-0.42px]">Allows comments</div>
// 				</div>
// 				<Switch checked={isEnabled} onChange={(checked) => {setValue("allowComments", checked); setIsEnabled(!isEnabled)}} />
// 			</div>
// 		</div>
// 	);
// }
