import {
  Box,
  Grid,
  Input,
  Pagination,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import api from 'api';
import React, { useCallback, useEffect, useState } from 'react';

const posts = [
  {
    id: 'b008aec8-9a24-4857-876f-8a5267e240e5',
    title: 'Hello World',
    content: 'OK',
    status: 'pending',
    checkerId: null,
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-05T08:03:49.795Z',
    updatedAt: '2022-06-05T08:03:49.795Z',
  },
  {
    id: '5adea936-c87d-4b2b-adad-941543ed9035',
    title: 'Hello World',
    content: 'OK',
    status: 'pending',
    checkerId: null,
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-05T08:03:49.234Z',
    updatedAt: '2022-06-05T08:03:49.234Z',
  },
  {
    id: 'f777f630-e8f9-449a-9762-8ae223268314',
    title: 'Hello World',
    content: 'OK',
    status: 'pending',
    checkerId: null,
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-05T08:03:48.676Z',
    updatedAt: '2022-06-05T08:03:48.676Z',
  },
  {
    id: '96fd1dca-5284-48f0-bd55-dd0d7c434530',
    title: 'Hello World',
    content: 'OK',
    status: 'pending',
    checkerId: null,
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-05T08:03:48.098Z',
    updatedAt: '2022-06-05T08:03:48.098Z',
  },
  {
    id: '7966a028-119b-4a67-bc40-d3543de0cb9c',
    title: 'Hello World',
    content: 'OK',
    status: 'pending',
    checkerId: null,
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-05T08:03:47.465Z',
    updatedAt: '2022-06-05T08:03:47.465Z',
  },
  {
    id: '6faa8327-6d91-4cc9-8bc3-6e36e0c7fc40',
    title: 'Hello World',
    content: 'OK',
    status: 'pending',
    checkerId: null,
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-05T08:03:46.764Z',
    updatedAt: '2022-06-05T08:03:46.764Z',
  },
  {
    id: 'bb8b4f45-998b-4ee0-a90a-ca935f2749a0',
    title: 'Hello World',
    content: 'OK',
    status: 'approved',
    checkerId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    authorId: '68dc5d79-5e62-45c5-a754-82331c46db0e',
    createdAt: '2022-06-04T04:03:14.095Z',
    updatedAt: '2022-06-04T04:21:35.232Z',
  },
];

const PostsListPage = () => {
  const [page, setPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(15);

  const [results, setResults] = useState({
    data: posts,
    totalCount: 0,
    loading: true,
  });

  const loadPosts = useCallback(
    async ({
      search = '',
      searchBy = ['title', 'content', 'author.username'],
      page = 1,
    }) => {
      console.log(search);
      const results = await api.posts.searchPosts({ search, searchBy, page });
    },
    [],
  );

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {results.loading &&
          Array.from(Array(postsPerPage).keys()).map((i) => (
            <Grid item md={3} key={i}>
              <Skeleton variant="text" />
              <Skeleton variant="rectangular" width={210} height={118} />
            </Grid>
          ))}
      </Grid>
      <Box mt={2}>
        <TextField
          value={postsPerPage}
          type="number"
          label="Posts Per Page"
          size="small"
          onChange={(e) => setPostsPerPage(parseInt(e.target.value) || 15)}
        />
        <Pagination count={0} />
      </Box>
    </Box>
  );
};

export default PostsListPage;
