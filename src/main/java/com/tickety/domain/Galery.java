package com.tickety.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tickety.domain.enumeration.GaleryStatus;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;

/**
 * A Galery.
 */
@Entity
@Table(name = "galery")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Galery implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private GaleryStatus status;

    @OneToMany(mappedBy = "galery", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "galery" }, allowSetters = true)
    private Set<Photo> photos = new HashSet<>();

    @JsonIgnoreProperties(value = { "galery", "artists", "tickets", "userAccount", "organization", "venue" }, allowSetters = true)
    @OneToOne(mappedBy = "galery")
    private Event event;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Galery id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Galery name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GaleryStatus getStatus() {
        return this.status;
    }

    public Galery status(GaleryStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(GaleryStatus status) {
        this.status = status;
    }

    public Set<Photo> getPhotos() {
        return this.photos;
    }

    public void setPhotos(Set<Photo> photos) {
        if (this.photos != null) {
            this.photos.forEach(i -> i.setGalery(null));
        }
        if (photos != null) {
            photos.forEach(i -> i.setGalery(this));
        }
        this.photos = photos;
    }

    public Galery photos(Set<Photo> photos) {
        this.setPhotos(photos);
        return this;
    }

    public Galery addPhoto(Photo photo) {
        this.photos.add(photo);
        photo.setGalery(this);
        return this;
    }

    public Galery removePhoto(Photo photo) {
        this.photos.remove(photo);
        photo.setGalery(null);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        if (this.event != null) {
            this.event.setGalery(null);
        }
        if (event != null) {
            event.setGalery(this);
        }
        this.event = event;
    }

    public Galery event(Event event) {
        this.setEvent(event);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Galery)) {
            return false;
        }
        return id != null && id.equals(((Galery) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Galery{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
