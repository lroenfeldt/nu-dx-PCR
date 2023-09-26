import React, { useRef, useEffect, useState } from "react";
import Next from "./../Icons/Next";
import Prev from "./../Icons/Prev";
import Testsmethod from "./Testmethod";
import { useData, useTranslation } from "../../hooks";
import { useNavigate } from "react-router-dom";
import rsv from "../../assets/images/tests/rsv.png";
import covid from "../../assets/images/tests/covid.png";
import hepatitis from "../../assets/images/tests/hepatitis.png";
import useTestSelectionStyle from "./useTestSelectionStyle";
import { Block, Text } from "..";
import { Modal } from "..";
import TestInfos from "./TestInfos";
import PaginationBullets from "./PaginationBullets";

const Testselection = () => {
	const testSelectionRef = useRef<HTMLDivElement>(null);
	const { setRemTime, testrun, setErrors, demo, settings } = useData();
	const [currentPage, setCurrentPage] = useState(0);

	const { locale, t } = useTranslation();
	const [scrolling, setScrolling] = useState<"left" | "right" | null>(null);
	const [isVisible, setIsvisible] = useState(false);
	const imges = [hepatitis, covid, rsv];
	const el = testSelectionRef.current;
	const totalContentWidth = el?.scrollWidth;
	const pageWidth = el?.offsetWidth;
	const testsCount = settings.account.testprocedures.length;
	const numberOfPages = totalContentWidth && pageWidth && Math.ceil(totalContentWidth / pageWidth);
	const navigate = useNavigate();
	const scroll = (direction: "left" | "right") => {
		const el = testSelectionRef.current;
		if (!el) return;

		const pageWidth = el.offsetWidth - 44;
		const scrollAmount = direction === "left" ? -pageWidth : pageWidth;
		const newPage = direction === "left" ? currentPage - 1 : currentPage + 1;
		console.log(newPage);

		el.scrollTo({
			left: el.scrollLeft + scrollAmount,
			behavior: "smooth",
		});
		if (numberOfPages && (newPage < 0 || newPage > numberOfPages - 1)) return;
		setCurrentPage(newPage);
	};
	const goToPage = (pageIndex: number) => {
		const el = testSelectionRef.current;
		if (!el) return;

		const pageWidth = el.offsetWidth - 44;
		const scrollToPosition = pageIndex * pageWidth;

		el.scrollTo({
			left: scrollToPosition,
			behavior: "smooth",
		});

		setCurrentPage(pageIndex);
	};

	useEffect(() => {
		if (scrolling) {
			window.requestAnimationFrame(() => scroll(scrolling));
		}
		return () => {
			setScrolling(null);
		};
	}, [scrolling]);

	useEffect(() => {
		const stopScrolling = () => setScrolling(null);
		window.addEventListener("mouseup", stopScrolling);

		return () => {
			window.removeEventListener("mouseup", stopScrolling);
		};
	}, [scrolling]);
	const selectTest = () => {
		if (settings.account.hasUserAuthentification || settings.account.askForLot) {
			navigate("/auth");
		} else {
			navigate("/enterBarcodes");
		}
	};

	return (
		<Block flex width={"100%"} height={"100%"}>
			<Block flex column center align="flex-start" width={"100%"}>
				<Modal isVisible={isVisible} setIsvisible={setIsvisible}>
					<TestInfos onClose={() => setIsvisible(false)} selectTest={selectTest} />
				</Modal>

				<Block padding={"0px 22px"} marginBottom={20}>
					<Text h1>{t("common.testSelection")}</Text>
				</Block>
				<Block
					position="relative"
					inlineFlex
					height="auto"
					width="100%"
					gap={54}
					paddingBottom={40}
					ref={testSelectionRef}
					padding={"0px 22px"}
					align="flex-start"
					scrollX>
					{testsCount > 3 && (
						<Block
							position="fixed"
							top="50%"
							right={0}
							transform="translateY(-50%)"
							transition="all 0.3s ease-in-out"
							border="0px solid transparent"
							cursor
							onMouseDown={() => setScrolling("right")}
							onClick={() => scroll("right")}
							onMouseUp={() => setScrolling(null)}>
							<Next />
						</Block>
					)}

					{settings.account.testprocedures.map((test, i) => (
						<Testsmethod
							key={i}
							title={(test as any)["label" + locale?.toUpperCase()]}
							image={imges[i % 3]}
							methodid={test.id}
							status={testrun ? "active" : ""}
							openInfos={() => setIsvisible(true)}
						/>
					))}
					{testsCount > 3 && (
						<Block
							position="fixed"
							top="50%"
							left={0}
							transform="translateY(-50%)"
							transition="all 0.3s ease-in-out"
							border="0px solid transparent"
							cursor
							onMouseDown={() => setScrolling("left")}
							onClick={() => scroll("left")}
							onMouseUp={() => setScrolling(null)}>
							<Prev />
						</Block>
					)}
					{testsCount > 3 && <PaginationBullets numberOfPages={numberOfPages || 0} currentPage={currentPage} goToPage={goToPage} />}
				</Block>
			</Block>
		</Block>
	);
};

export default Testselection;
