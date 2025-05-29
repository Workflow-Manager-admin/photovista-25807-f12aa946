 * The core container for the PhotoVista Android app, written in JavaScript (ES6+).
 * Implements photo gallery, album management, favorites, sharing, and detailed photo info
 * with a light theme and the provided color scheme.
 *
 * Color scheme:
 *   primary:   #2196F3
 *   secondary: #FFFFFF
 *   accent:    #FF4081
 *
 * Note: This file represents the ES6+ logic. Integration with Android can be achieved
 * via a JS bridge (e.g., React Native, Cordova, or similar framework), but this code
 * emphasizes main logic and UI layout structure per instructions.
 */

// PUBLIC_INTERFACE
class MainContainer {
    /**
     * Creates a new PhotoVista app main container instance.
     * Manages navigation, state, and renders main sections.
     */
    constructor(rootElement) {
        /** @type {HTMLElement} Root DOM node for this app. */
        this.rootElement = rootElement;

        // Application state
        this.state = {
            currentTab: 'Gallery', // 'Gallery' | 'Albums' | 'Favorites' | 'Settings'
            photos: [], // [{id, src, date, location, size, albumId, isFavorite}]
            albums: [], // [{id, name}]
            selectedPhoto: null, // Photo object if a photo is open fullscreen
            showPhotoDetails: false,
        };

        // Color scheme (could be read from theme or constants)
        this.colors = {
            primary: '#2196F3',
            secondary: '#FFFFFF',
            accent: '#FF4081',
        };

        this.render();
    }

    // PUBLIC_INTERFACE
    render() {
        /** Renders the main container and subcomponents into the rootElement. */
        this.rootElement.innerHTML = '';
        this.rootElement.style.background = this.colors.secondary;
        this.rootElement.style.minHeight = '100vh';
        this.rootElement.style.display = 'flex';
        this.rootElement.style.flexDirection = 'column';

        // If a photo is selected in fullscreen mode, render PhotoView
        if (this.state.selectedPhoto) {
            this.rootElement.appendChild(this.renderPhotoView());
            return;
        }

        // Main content area (above the bottom nav)
        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.overflowY = 'auto';
        content.style.padding = '8px 0';

        // Render the appropriate tab content
        if (this.state.currentTab === 'Gallery') {
            content.appendChild(this.renderGallery());
        } else if (this.state.currentTab === 'Albums') {
            content.appendChild(this.renderAlbums());
        } else if (this.state.currentTab === 'Favorites') {
            content.appendChild(this.renderFavorites());
        } else if (this.state.currentTab === 'Settings') {
            content.appendChild(this.renderSettings());
        }

        this.rootElement.appendChild(content);

        // Bottom navigation bar
        this.rootElement.appendChild(this.renderBottomNav());
    }

    // PUBLIC_INTERFACE
    renderGallery() {
        /** Renders the photo gallery grid. */
        const gallery = document.createElement('div');
        gallery.style.display = 'grid';
        gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gallery.style.gap = '8px';

        if (this.state.photos.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.textContent = 'No photos found.';
            placeholder.style.color = '#999';
            placeholder.style.gridColumn = '1 / -1';
            placeholder.style.textAlign = 'center';
            placeholder.style.padding = '48px 0';
            gallery.appendChild(placeholder);
            return gallery;
        }

        this.state.photos.forEach(photo => {
            const thumb = document.createElement('div');
            thumb.style.background = `url(${photo.src}) center center / cover`;
            thumb.style.borderRadius = '6px';
            thumb.style.position = 'relative';
            thumb.style.height = '100px';
            thumb.style.cursor = 'pointer';
            thumb.title = 'Tap for details';

            // Favorite indicator
            if (photo.isFavorite) {
                const fav = document.createElement('span');
                fav.textContent = '★';
                fav.style.position = 'absolute';
                fav.style.top = '4px';
                fav.style.right = '6px';
                fav.style.color = this.colors.accent;
                fav.style.textShadow = '0 1px 4px #fff8';
                thumb.appendChild(fav);
            }

            thumb.onclick = () => {
                this.state.selectedPhoto = photo;
                this.render();
            };
            gallery.appendChild(thumb);
        });

        return gallery;
    }

    // PUBLIC_INTERFACE
    renderBottomNav() {
        /** Renders the bottom navigation bar. */
        const nav = document.createElement('nav');
        nav.style.height = '60px';
        nav.style.background = this.colors.primary;
        nav.style.display = 'flex';
        nav.style.justifyContent = 'space-evenly';
        nav.style.alignItems = 'center';
        nav.style.boxShadow = '0 -2px 4px #0002';

        // Navigation buttons
        const tabs = [
            { key: 'Gallery', icon: '🖼️', label: 'Gallery' },
            { key: 'Albums', icon: '📁', label: 'Albums' },
            { key: 'Favorites', icon: '★', label: 'Favorites' },
            { key: 'Settings', icon: '⚙️', label: 'Settings' }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.textContent = `${tab.icon}
${tab.label}`;
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.color = this.state.currentTab === tab.key ? this.colors.accent : this.colors.secondary;
            btn.style.fontSize = '14px';
            btn.style.display = 'flex';
            btn.style.flexDirection = 'column';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.flex = '1';
            btn.style.cursor = 'pointer';
            btn.style.height = '100%';
            btn.style.padding = '4px 0';

            btn.onclick = () => {
                this.state.currentTab = tab.key;
                this.state.selectedPhoto = null;
                this.render();
            };

            nav.appendChild(btn);
        });

        return nav;
    }

    // PUBLIC_INTERFACE
    renderAlbums() {
        /** Renders the Albums management tab. */
        const albumsDiv = document.createElement('div');
        albumsDiv.style.padding = '16px';

        const header = document.createElement('h2');
        header.textContent = 'Albums';
        header.style.color = this.colors.primary;
        albumsDiv.appendChild(header);

        // List of albums
        if (this.state.albums.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No albums created yet.';
            emptyMsg.style.color = '#aaa';
            albumsDiv.appendChild(emptyMsg);
        } else {
            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';
            ul.style.padding = '0';

            this.state.albums.forEach(album => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '8px 0';

                const name = document.createElement('span');
                name.textContent = album.name;

                // Edit and delete album (stubs, should implement popup/modal for real interaction)
                const actions = document.createElement('span');
                const editBtn = document.createElement('button');
                editBtn.textContent = '✏️';
                editBtn.title = 'Edit Album';
                editBtn.style.background = 'none';
                editBtn.style.border = 'none';
                editBtn.onclick = () => alert('Edit album functionality not implemented');
                actions.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '🗑️';
                deleteBtn.title = 'Delete Album';
                deleteBtn.style.background = 'none';
                deleteBtn.style.border = 'none';
                deleteBtn.onclick = () => alert('Delete album functionality not implemented');
                actions.appendChild(deleteBtn);

                li.appendChild(name);
                li.appendChild(actions);
                ul.appendChild(li);
            });
            albumsDiv.appendChild(ul);
        }

        // Add Album button (stub)
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Album';
        addBtn.style.background = this.colors.accent;
        addBtn.style.color = this.colors.secondary;
        addBtn.style.border = 'none';
        addBtn.style.borderRadius = '4px';
        addBtn.style.padding = '8px 14px';
        addBtn.style.marginTop = '8px';
        addBtn.style.cursor = 'pointer';
        addBtn.onclick = () => alert('Add album functionality not implemented');
        albumsDiv.appendChild(addBtn);

        return albumsDiv;
    }

    // PUBLIC_INTERFACE
    renderFavorites() {
        /** Renders the favorites gallery grid. */
        const favsDiv = document.createElement('div');
        favsDiv.style.padding = '8px';

        const header = document.createElement('h2');
        header.textContent = 'Favorites';
        header.style.color = this.colors.primary;
        favsDiv.appendChild(header);

        const favPhotos = this.state.photos.filter(p => p.isFavorite);

        const gallery = document.createElement('div');
        gallery.style.display = 'grid';
        gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gallery.style.gap = '8px';

        if (favPhotos.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No favorites yet.';
            emptyMsg.style.color = '#aaa';
            emptyMsg.style.textAlign = 'center';
            gallery.appendChild(emptyMsg);
        } else {
            favPhotos.forEach(photo => {
                const thumb = document.createElement('div');
                thumb.style.background = `url(${photo.src}) center center / cover`;
                thumb.style.height = '100px';
                thumb.style.borderRadius = '6px';
                thumb.style.cursor = 'pointer';
                thumb.title = 'Tap for details';

                thumb.onclick = () => {
                    this.state.selectedPhoto = photo;
                    this.render();
                };
                gallery.appendChild(thumb);
            });
        }

        favsDiv.appendChild(gallery);
        return favsDiv;
    }

    // PUBLIC_INTERFACE
    renderPhotoView() {
        /** Renders fullscreen view of a selected photo, with options. */
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = '#000b';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 2000;

        const photo = this.state.selectedPhoto;
        if (!photo) return overlay;

        // Photo image
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = 'Photo';
        img.style.maxWidth = '90vw';
        img.style.maxHeight = '60vh';
        img.style.borderRadius = '12px';
        img.style.boxShadow = '0 8px 40px #000a';
        overlay.appendChild(img);

        // Actions: Share, Favorite, Details, Close
        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '16px';
        actions.style.marginTop = '14px';

        // Share (stub)
        const shareBtn = document.createElement('button');
        shareBtn.textContent = 'Share';
        shareBtn.style.background = this.colors.primary;
        shareBtn.style.color = this.colors.secondary;
        shareBtn.style.border = 'none';
        shareBtn.style.borderRadius = '4px';
        shareBtn.style.padding = '8px 12px';
        shareBtn.style.cursor = 'pointer';
        shareBtn.onclick = () => alert('Photo sharing not implemented');
        actions.appendChild(shareBtn);

        // Favorite toggle
        const favBtn = document.createElement('button');
        favBtn.textContent = photo.isFavorite ? '★ Unfavorite' : '☆ Favorite';
        favBtn.style.background = this.colors.accent;
        favBtn.style.color = this.colors.secondary;
        favBtn.style.border = 'none';
        favBtn.style.borderRadius = '4px';
        favBtn.style.padding = '8px 12px';
        favBtn.style.cursor = 'pointer';
        favBtn.onclick = () => {
            photo.isFavorite = !photo.isFavorite;
            this.state.selectedPhoto = null;
            this.render();
        };
        actions.appendChild(favBtn);

        // Details
        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = 'Details';
        detailsBtn.style.background = '#eee';
        detailsBtn.style.color = '#444';
        detailsBtn.style.border = 'none';
        detailsBtn.style.borderRadius = '4px';
        detailsBtn.style.padding = '8px 12px';
        detailsBtn.style.cursor = 'pointer';
        detailsBtn.onclick = () => {
            this.state.showPhotoDetails = !this.state.showPhotoDetails;
            this.render();
        };
        actions.appendChild(detailsBtn);

        // Close
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.background = '#ccc';
        closeBtn.style.color = '#444';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.padding = '8px 12px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => {
            this.state.selectedPhoto = null;
            this.state.showPhotoDetails = false;
            this.render();
        };
        actions.appendChild(closeBtn);

        overlay.appendChild(actions);

        // Details panel
        if (this.state.showPhotoDetails) {
            const panel = document.createElement('div');
            panel.style.background = '#fff';
            panel.style.color = '#222';
            panel.style.marginTop = '16px';
            panel.style.borderRadius = '8px';
            panel.style.boxShadow = '0 2px 16px #0003';
            panel.style.padding = '16px 24px';
            panel.style.textAlign = 'left';
            panel.style.minWidth = '200px';
            panel.innerHTML =
                `<b>Date:</b> ${photo.date || 'Unknown'}<br>` +
                `<b>Location:</b> ${photo.location || 'Unknown'}<br>` +
                `<b>Size:</b> ${photo.size || 'Unknown'}`;
            overlay.appendChild(panel);
        }

        return overlay;
    }

    // PUBLIC_INTERFACE
    renderSettings() {
        /** Renders the Settings tab (stub). */
        const settingsDiv = document.createElement('div');
        settingsDiv.style.padding = '16px';
        const header = document.createElement('h2');
        header.textContent = 'Settings';
        header.style.color = this.colors.primary;
        settingsDiv.appendChild(header);

        // Placeholder
        const msg = document.createElement('p');
        msg.textContent = 'Settings functionality coming soon.';
        msg.style.color = '#aaa';
        settingsDiv.appendChild(msg);

        return settingsDiv;
    }

    // PUBLIC_INTERFACE
    setPhotos(photos) {
        /** Set the array of photo objects for the gallery. */
        this.state.photos = photos.slice();
        this.render();
    }

    // PUBLIC_INTERFACE
    setAlbums(albums) {
        /** Set the array of albums. */
        this.state.albums = albums.slice();
        this.render();
    }
}

// Attach to global for demo/testing if needed
// window.PhotoVistaMainContainer = MainContainer;

export default MainContainer;
