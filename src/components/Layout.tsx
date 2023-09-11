import Header from "./Header/index";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import Errors from "./Errors";
import { useData } from "../hooks";
import ShutdownNotification from "./ShutdownNotification";
import { IChildren } from "../types/interfaces/interfaces";
import Main from "./Main";
import Container from "./Container";

export default function Layout({ children }: IChildren) {
	const location = useLocation();
	const { demo } = useData();

	return (
		<Main>
			<Header />
			<Container>{children}</Container>
			<Footer />
		</Main>
	);
}

/**<div className="App">
<Header />
<ShutdownNotification />
{!demo && <Errors />}
<div className={location.pathname == '/selectMethod' ? '' : 'Main'}>{children}</div>
<Footer />
</div>**/
