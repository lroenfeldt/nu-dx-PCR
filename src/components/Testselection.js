import React, { useCallback, useEffect } from 'react';
import { useData, useTranslation } from '../hooks';
import Errors from './Errors';
import Testsmethod from './Testmethod';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Testselection = () => {
  const { setRemTime, testrun, errors, setErrors, demo, settings } = useData();
  const { locale } = useTranslation();

  return (
    <div className="Testselection">
      <Swiper
        width={settings.account.testprocedures.length > 2 ? 1038 : 700}
        modules={[Pagination]}
        spaceBetween={30}
        centeredSlides={false}
        slidesPerView={settings.account.testprocedures.length > 2 ? 3 : 2}
        pagination={{ clickable: true }}
      >
        {settings.account.testprocedures.map((test, i) => {
          return (
            <SwiperSlide key={i}>
              <Testsmethod
                key={i}
                title={test['label' + locale?.toUpperCase()]}
                methodid={test.id}
                testrun={testrun}
                testDuration={test.durationMinutes}
                setRemTime={setRemTime}
                setErrors={setErrors}
                demo={demo}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Testselection;
