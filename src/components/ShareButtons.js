import React from 'react'
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
  } from 'next-share';

export default function ShareButtons({ quote }) {
  return (
    <div className='shareButtons'>
        <FacebookShareButton url={window.location.href} quote={quote}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={window.location.href} title={quote}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton url={window.location.href} title={quote}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
    </div>
  )
}
