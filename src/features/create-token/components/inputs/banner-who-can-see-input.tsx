// import { useFormContext } from "react-hook-form";
// import type { BannerFormData } from "../../schema";
// import { BottomBar, Button, RadioGroup, RadioGroupItem } from "@worldcoin/mini-apps-ui-kit-react";
// import { useState } from "react";
// import { BottomDraw } from "@/components/shared/bottom-draw";

// const ArrowRightIcon = () => {
// 	return (
// 		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
// 			<path fillRule="evenodd" clipRule="evenodd" d="M13.0883 9.4112C13.2445 9.56747 13.3323 9.77939 13.3323 10.0004C13.3323 10.2213 13.2445 10.4333 13.0883 10.5895L8.37415 15.3037C8.29727 15.3833 8.20532 15.4468 8.10365 15.4904C8.00198 15.5341 7.89263 15.5571 7.78198 15.5581C7.67133 15.559 7.5616 15.538 7.45919 15.496C7.35677 15.4541 7.26373 15.3923 7.18548 15.314C7.10724 15.2358 7.04536 15.1427 7.00346 15.0403C6.96156 14.9379 6.94048 14.8282 6.94144 14.7175C6.9424 14.6069 6.96539 14.4975 7.00906 14.3959C7.05274 14.2942 7.11622 14.2022 7.19581 14.1254L11.3208 10.0004L7.19581 5.87536C7.04401 5.71819 6.96002 5.5077 6.96192 5.2892C6.96382 5.0707 7.05146 4.86169 7.20596 4.70718C7.36047 4.55268 7.56948 4.46503 7.78798 4.46314C8.00648 4.46124 8.21698 4.54523 8.37415 4.69703L13.0883 9.4112Z" fill="#141416" />
// 		</svg>
// 	)
// }

// const EarthIcon = () => {
// 	return (
// 		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
// 			<path fillRule="evenodd" clipRule="evenodd" d="M16.4439 11.1514C14.2272 10.5931 13.2856 7.85976 15.9106 7.17643C16.5106 8.44309 16.7022 9.75975 16.4439 11.1514ZM12.9189 12.9264C12.4189 13.7348 11.7022 14.4014 11.6106 15.4181C11.4772 15.9264 11.3439 16.5264 10.6772 16.5098C9.57724 16.3514 10.2272 14.8514 9.57725 14.1931C9.06891 13.6431 8.91058 12.9848 8.99391 12.2431C8.96891 11.2514 8.03556 11.0014 7.30223 10.5848C5.91056 9.91809 5.05223 8.67642 4.25223 7.4181C3.9689 6.30143 5.6189 5.22643 6.3689 4.57643C7.90223 3.07643 7.95223 5.27643 8.89391 4.3931C9.08558 2.8431 11.3189 4.4681 10.6272 5.37643C9.57725 5.90976 10.7689 6.32643 10.1272 6.8681C8.95225 6.97643 8.89391 7.63476 9.51891 8.51809C9.73558 9.34309 8.85225 8.85142 8.55225 8.58475C8.1189 8.50142 6.55223 8.85975 7.1189 9.49309C7.57723 10.0181 8.32723 9.80975 8.81891 10.2181C9.01891 10.4264 9.15225 10.7348 9.38558 10.9014C10.7189 11.2681 13.4189 10.4848 12.9189 12.9264ZM18.0356 9.27642C17.7856 6.32643 15.9022 3.75976 13.2106 2.5931C11.3606 1.7931 9.32725 1.68476 7.11056 2.50976C6.1939 2.85143 5.33556 3.35143 4.61056 4.00143C2.93556 5.4931 2.02723 7.45143 1.93556 9.80142C1.88556 11.2098 2.2189 12.6264 2.91056 13.8514C4.12723 15.9848 5.91056 17.3181 8.18556 17.8514C8.60225 17.9514 9.03558 17.9848 9.46058 18.0431C9.49391 18.0514 9.51891 18.0514 9.54391 18.0598H10.4606C10.5606 18.0514 10.6606 18.0348 10.7606 18.0264C11.9856 17.8848 13.1939 17.5348 14.2272 16.8681C16.1272 15.6598 17.3439 13.9764 17.8606 11.8181C18.0606 10.9848 18.1106 10.1348 18.0356 9.27642Z" fill="#23262F" />
// 		</svg>
// 	)
// }

// const list = ["public", "followers", "friends", "onlyYou"]
// export function BannerWhoCanSeeInput() {
// 	const {
// 		setValue,
// 		watch
// 	} = useFormContext<BannerFormData>();
// 	const [open, setOpen] = useState(false);
// 	const whoCanSee = watch("whoCanSee");
// 	const [value, setValueState] = useState(whoCanSee);
// 	// Function to handle tag selection
// 	// console.log("Selected Tags:", selectedTags);
// 	const handleSave = () => {
// 		setValue("whoCanSee", value);
// 		setOpen(false);
// 	}
// 	return (
// 		<div className="">
// 			<div className="flex justify-between items-center" onClick={() => setOpen(true)}>
// 				<div className="flex justify-center items-center gap-2">
// 					<EarthIcon />
// 					<div className="text-[14px] not-italic font-medium leading-[20px] tracking-[-0.42px]">Anyone can see this</div>
// 				</div>
// 				<ArrowRightIcon/>
// 			</div>
// 			<BottomDraw isOpen={open} onClose={() => setOpen(false)} title="Select who can see this">

// 				<div className=" p-4 flex flex-col gap-1">
// 					<RadioGroup value={value} onChange={(value) => setValueState(value as any)}>
// 					{
// 						list.map(item => (
// 							<div key={item} className="flex justify-between">
// 								<span className=" p-2 text-[14px] not-italic font-medium leading-[20px] tracking-[-0.56px]">{item}</span>
// 								<RadioGroupItem value={item}  />
// 							</div>
// 						))
// 					}
// 					</RadioGroup>
// 				</div>
// 				<div className="px-4">
// 					<BottomBar>
// 						<Button onClick={handleSave}>Save</Button>
// 					</BottomBar>
// 				</div>

// 			</BottomDraw>
// 		</div>
// 	);
// }
