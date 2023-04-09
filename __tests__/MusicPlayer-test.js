
import React from 'react';
import 'react-native';
import MusicPlayer from '../screens/MusicPlayer';

import renderer from 'react-test-renderer';

test('MusicPlayer Snapshot',()=>{
    const snap=renderer.create(
        <MusicPlayer />
    ).toJSON();
expect(snap).toMatchSnapshot();
});
