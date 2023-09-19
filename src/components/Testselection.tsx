import { useData, useTranslation } from "../hooks";
import Testsmethod from "./Testmethod";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Testselection = () => {
	const { testrun, settings } = useData();
	const { locale } = useTranslation();

	return (
		<div className="Testselection">
			<Swiper
				width={settings.account.testprocedures.length > 2 ? 1038 : 700}
				modules={[Pagination]}
				spaceBetween={30}
				centeredSlides={false}
				slidesPerView={settings.account.testprocedures.length > 2 ? 3 : 2}
				pagination={{ clickable: true }}>
				{settings.account.testprocedures.map((test, i) => {
					return (
						<SwiperSlide key={i}>
							<Testsmethod key={i} title={(test as any)["label" + locale?.toUpperCase()]} methodid={test.id} status={testrun ? "active" : ""} />
						</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
};

export default Testselection;
