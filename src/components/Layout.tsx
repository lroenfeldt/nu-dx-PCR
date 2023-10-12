import Header from "./Header/index";
import Footer from "./Footer";
import { IChildren } from "../types/interfaces/interfaces";
import Main from "./Main";
import Container from "./Container";

export default function Layout({ children }: IChildren) {
  return (
    <Main>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </Main>
  );
}
