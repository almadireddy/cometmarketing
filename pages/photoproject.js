import React, { Component } from 'react';
import { withRouter } from 'next/router'
import Link from "next/link";
import Layout from '../components/Layout';
import fetch from 'node-fetch';
import {
  Container,
  Row,
  Col,
  Breadcrumb, 
  BreadcrumbItem
} from 'reactstrap';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import DynamicLink from '../components/DynamicLink';

class Photoproject extends Component {
  constructor(){
    super();
    this.state = { currentImage: 0 };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.getDate = this.getDate.bind(this);
  }
  static async getInitialProps({query}) {
    const res = await fetch(`https://utdcometmarketing-api.herokuapp.com/photoprojects/${query.slug}`)
    const data = await res.json()
    return {
      project: data
    }
  }

  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true,
    });
  }

  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false,
    });
  }
  
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }

  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  getDate() {
    var d = new Date(this.props.project.date)
    var string = d.toDateString()
    return string
  }

  render() {
    const galleryPhotos = this.props.project.photos.map((photo, i) => {
      return {
        src: photo.url,
        width: 3,
        height: 2,
        alt: photo.url
      }
    })
    return(
      <Layout pageName={this.props.project.title} title={this.props.project.title}>
        <Container>
          <Row className='breadcrumb-row row-no-margin'>
            <Col>
              <Breadcrumb>
                <BreadcrumbItem><a href="/index">Home</a></BreadcrumbItem>
                <BreadcrumbItem><a href="/portfolio">Portfolio</a></BreadcrumbItem>
                <BreadcrumbItem active>{this.props.project.title}</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col sm='8'>
              <p className='lead'>{this.props.project.description}</p>
            </Col>
          </Row>
          <Gallery photos={galleryPhotos} onClick={this.openLightbox} />
          <Lightbox images={galleryPhotos}
            onClose={this.closeLightbox}
            onClickPrev={this.gotoPrevious}
            onClickNext={this.gotoNext}
            currentImage={this.state.currentImage}
            isOpen={this.state.lightboxIsOpen}
          />
          <Row className='recent-projects-row row-no-margin project-members'>
          <Col sm='8'>
            <p className='lead'>Project Members:</p>
            {this.props.project.members.map((person) => (
              <DynamicLink displayRoute='people' actualRoute='person' slug={person.slug}>
                  <h2 className='lead'>{person.name}</h2>
              </DynamicLink>
            ))}
          </Col>
          <Col sm='4'>
              <p className='lead text-right'>{this.getDate()}</p>
          </Col>
          </Row>
        </Container>
      </Layout>
    )
  }
}

export default withRouter(Photoproject);