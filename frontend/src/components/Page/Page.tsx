/* eslint-disable no-undef */
import React, { useEffect } from 'react';
//import { Helmet } from 'react-helmet';

import useRouter from 'utils/useRouter';

const NODE_ENV = process.env.NODE_ENV;

interface IPageProps {
  className: string
  title: string;
  children: any;
}

const Page = (props:IPageProps) => {
  const { title, children, ...rest } = props;

  const router = useRouter();

  useEffect(() => {
    if (NODE_ENV !== 'production') {
      return;
    }

  }, [title, router]);

  return (
    <div {...rest}>
        <title>{title}</title>
      {children}
    </div>
  );
};


export default Page;
